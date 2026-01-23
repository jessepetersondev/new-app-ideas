import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { usageTracking } from "@/lib/schema";

/**
 * GET /api/usage
 *
 * Returns the current user's usage statistics including their tier,
 * today's prediction count, and remaining predictions.
 *
 * Requires authentication.
 */
export async function GET() {
  try {
    // Get session from BetterAuth
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // Check if user is authenticated
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get today's date at midnight (UTC)
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);

    // Query usage tracking for today
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

    // Get today's prediction count
    const todayCount = usageRecords.length > 0 && usageRecords[0]
      ? parseInt(usageRecords[0].predictionCount, 10)
      : 0;

    // Free tier daily limit (from env or default to 3)
    const dailyLimit = parseInt(
      process.env.NEXT_PUBLIC_FREE_DAILY_LIMIT || "3",
      10
    );

    // Calculate remaining predictions
    const remainingToday = Math.max(0, dailyLimit - todayCount);

    // Return usage statistics
    return NextResponse.json({
      tier: "free",
      todayCount,
      dailyLimit,
      remainingToday,
    });

  } catch (error) {
    console.error("Error fetching usage statistics:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
