import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { generateText } from "ai";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { predictions, usageTracking } from "@/lib/schema";

/**
 * Detailed virality analysis prompt for OpenRouter AI
 */
const VIRALITY_PROMPT = `You are an expert social media analyst specializing in Twitter/X virality prediction. Analyze the given tweet text and provide a detailed virality assessment.

You must respond with a valid JSON object following this exact structure:

{
  "viralityScore": <number 0-100>,
  "confidence": <number 0-100>,
  "factors": {
    "sentiment": {
      "label": "<positive|negative|neutral>",
      "score": <number 0-100>
    },
    "hashtags": {
      "count": <number>,
      "trending": <boolean>
    },
    "length": {
      "characters": <number>,
      "optimal": <boolean>
    },
    "emojis": {
      "count": <number>,
      "impact": "<high|medium|low>"
    },
    "buzzwords": {
      "count": <number>,
      "words": [<array of strings>]
    }
  },
  "suggestions": [<array of 3-5 actionable suggestion strings>]
}

Analysis Guidelines:
1. viralityScore: Overall virality potential (0-100)
   - 0-30: Low viral potential
   - 31-60: Moderate viral potential
   - 61-85: High viral potential
   - 86-100: Very high viral potential

2. confidence: How confident you are in the prediction (0-100)

3. sentiment: Analyze emotional tone
   - label: positive/negative/neutral
   - score: intensity of sentiment (0-100)

4. hashtags: Count hashtags and assess if they're trending topics
   - count: number of hashtags found
   - trending: whether hashtags relate to current trending topics

5. length: Character count and optimal length assessment
   - characters: actual character count
   - optimal: true if 100-280 characters (ideal for engagement)

6. emojis: Count emojis and assess their impact
   - count: number of emojis
   - impact: high (3+ emojis), medium (1-2 emojis), low (0 emojis)

7. buzzwords: Identify viral/trendy words
   - count: number of buzzwords found
   - words: array of identified buzzwords (e.g., "AI", "breaking", "exclusive", "viral", "must-see", etc.)

8. suggestions: 3-5 specific, actionable recommendations to improve virality
   - Focus on concrete changes (e.g., "Add 1-2 relevant hashtags", "Reduce length to 200 characters")
   - Prioritize high-impact suggestions

Respond ONLY with the JSON object, no additional text.`;

/**
 * POST /api/predict
 *
 * Accepts tweet text, validates usage limits, calls OpenRouter AI for virality analysis,
 * saves prediction to database, and returns the prediction with remaining count.
 *
 * Requires authentication.
 */
export async function POST(request: Request) {
  try {
    // Get session from BetterAuth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Authentication required. Please log in to use the predictor.",
          code: "AUTH_REQUIRED"
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Parse request body
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          error: "Invalid request format. Please try again.",
          code: "INVALID_REQUEST"
        },
        { status: 400 }
      );
    }

    const { tweetText } = body;

    // Validate tweet text is present
    if (!tweetText || typeof tweetText !== "string") {
      return NextResponse.json(
        {
          error: "Please enter some text to analyze.",
          code: "MISSING_TEXT"
        },
        { status: 400 }
      );
    }

    // Validate tweet text is not empty (trim whitespace)
    const trimmedText = tweetText.trim();
    if (trimmedText.length === 0) {
      return NextResponse.json(
        {
          error: "Please enter some text to analyze.",
          code: "EMPTY_TEXT"
        },
        { status: 400 }
      );
    }

    // Validate tweet text is under 500 characters
    if (trimmedText.length > 500) {
      return NextResponse.json(
        {
          error: "Your post is too long. Please keep it under 500 characters.",
          code: "TEXT_TOO_LONG"
        },
        { status: 400 }
      );
    }

    // Get today's date at midnight (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Get daily limit from environment
    const dailyLimit = parseInt(
      process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || "3",
      10
    );

    // Check usage limit
    const usageRecords = await db
      .select()
      .from(usageTracking)
      .where(
        and(
          eq(usageTracking.userId, userId),
          eq(usageTracking.date, today)
        )
      )
      .limit(1);

    const todayCount = usageRecords.length > 0 && usageRecords[0]
      ? parseInt(usageRecords[0].predictionCount, 10)
      : 0;

    // Check if daily limit exceeded
    if (todayCount >= dailyLimit) {
      return NextResponse.json(
        {
          error: `You've reached your daily limit of ${dailyLimit} predictions. Your limit will reset tomorrow.`,
          code: "RATE_LIMIT_EXCEEDED",
          dailyLimit,
          todayCount,
          remainingPredictions: 0,
          message: "Upgrade to get unlimited predictions!"
        },
        { status: 429 }
      );
    }

    // Call OpenRouter AI for virality analysis
    const model = process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini";

    let aiResponse;
    try {
      const result = await generateText({
        model: openrouter(model),
        prompt: `${VIRALITY_PROMPT}\n\nTweet to analyze:\n"${trimmedText}"`,
        temperature: 0.7,
      });

      aiResponse = result.text;
    } catch (error) {
      console.error("OpenRouter AI error:", error);

      // Check for specific error types
      const errorMessage = error instanceof Error ? error.message : String(error);

      if (errorMessage.includes("network") || errorMessage.includes("fetch")) {
        return NextResponse.json(
          {
            error: "Network error. Please check your connection and try again.",
            code: "NETWORK_ERROR",
            retryable: true
          },
          { status: 503 }
        );
      }

      if (errorMessage.includes("timeout")) {
        return NextResponse.json(
          {
            error: "Request timed out. Please try again.",
            code: "TIMEOUT_ERROR",
            retryable: true
          },
          { status: 504 }
        );
      }

      return NextResponse.json(
        {
          error: "Failed to analyze your post. Please try again in a moment.",
          code: "AI_ERROR",
          retryable: true
        },
        { status: 500 }
      );
    }

    // Parse AI response as JSON
    let prediction;
    try {
      prediction = JSON.parse(aiResponse);
    } catch {
      console.error("Failed to parse AI response as JSON:", aiResponse);
      return NextResponse.json(
        {
          error: "Received an invalid response from the AI. Please try again.",
          code: "PARSE_ERROR",
          retryable: true
        },
        { status: 500 }
      );
    }

    // Validate prediction structure
    if (
      typeof prediction.viralityScore !== "number" ||
      typeof prediction.confidence !== "number" ||
      !prediction.factors ||
      !prediction.factors.sentiment ||
      !prediction.factors.hashtags ||
      !prediction.factors.length ||
      !prediction.factors.emojis ||
      !prediction.factors.buzzwords ||
      !Array.isArray(prediction.suggestions)
    ) {
      console.error("Invalid prediction structure:", prediction);
      return NextResponse.json(
        {
          error: "Received an incomplete prediction. Please try again.",
          code: "VALIDATION_ERROR",
          retryable: true
        },
        { status: 500 }
      );
    }

    // Generate unique ID for prediction
    const predictionId = crypto.randomUUID();

    // Save prediction and update usage in a transaction
    await db.transaction(async (tx) => {
      // Save prediction to database
      await tx.insert(predictions).values({
        id: predictionId,
        userId,
        tweetText: trimmedText,
        viralityScore: prediction.viralityScore.toString(),
        confidence: prediction.confidence.toString(),
        sentiment: prediction.factors.sentiment.label,
        sentimentScore: prediction.factors.sentiment.score.toString(),
        hashtagCount: prediction.factors.hashtags.count.toString(),
        hashtagTrending: prediction.factors.hashtags.trending,
        lengthCharacters: prediction.factors.length.characters.toString(),
        lengthOptimal: prediction.factors.length.optimal,
        emojiCount: prediction.factors.emojis.count.toString(),
        emojiImpact: prediction.factors.emojis.impact,
        buzzwordCount: prediction.factors.buzzwords.count.toString(),
        buzzwords: JSON.stringify(prediction.factors.buzzwords.words),
        suggestions: JSON.stringify(prediction.suggestions),
      });

      // Increment usage count
      if (usageRecords.length > 0 && usageRecords[0]) {
        // Update existing record
        await tx
          .update(usageTracking)
          .set({
            predictionCount: (todayCount + 1).toString(),
          })
          .where(eq(usageTracking.id, usageRecords[0].id));
      } else {
        // Create new record for today
        await tx.insert(usageTracking).values({
          id: crypto.randomUUID(),
          userId,
          date: today,
          predictionCount: "1",
        });
      }
    });

    // Calculate remaining predictions
    const remainingPredictions = Math.max(0, dailyLimit - (todayCount + 1));

    // Return prediction with remaining count
    return NextResponse.json({
      success: true,
      data: {
        id: predictionId,
        viralityScore: prediction.viralityScore,
        confidence: prediction.confidence,
        factors: prediction.factors,
        suggestions: prediction.suggestions,
      },
      remainingPredictions,
    });

  } catch (error) {
    console.error("Error processing prediction:", error);
    return NextResponse.json(
      {
        error: "An unexpected error occurred. Please try again.",
        code: "INTERNAL_ERROR",
        retryable: true
      },
      { status: 500 }
    );
  }
}
