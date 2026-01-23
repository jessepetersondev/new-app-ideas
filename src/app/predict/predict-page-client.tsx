"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { ErrorBoundary } from "@/components/error-boundary";
import { PredictionResult } from "@/components/predict/prediction-result";
import { TweetInput } from "@/components/predict/tweet-input";
import { UsageIndicator, refreshUsageIndicator } from "@/components/predict/usage-indicator";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ViralityPrediction } from "@/types/prediction";

interface User {
  id: string;
  email: string;
  name: string;
}

interface PredictPageClientProps {
  user: User;
}

interface UsageData {
  tier: string;
  todayCount: number;
  dailyLimit: number;
  remainingToday: number;
}

/**
 * Client component for the predict page
 * Handles all interactivity: tweet input, prediction API calls, and result display
 */
export function PredictPageClient({ user }: PredictPageClientProps) {
  const [tweetText, setTweetText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<ViralityPrediction | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [inputError, setInputError] = useState<string | null>(null);
  const [usageData, setUsageData] = useState<UsageData | null>(null);

  // Handle usage data updates from UsageIndicator
  const handleUsageUpdate = (usage: UsageData) => {
    setUsageData(usage);
  };

  // Handle text change with validation
  const handleTextChange = (newText: string) => {
    setTweetText(newText);

    // Clear input error when user starts typing
    if (inputError) {
      setInputError(null);
    }

    // Validate as user types
    const trimmed = newText.trim();
    if (trimmed.length === 0 && newText.length > 0) {
      setInputError("Please enter some text");
    } else if (newText.length > 280) {
      setInputError("Tweet exceeds 280 characters");
    }
  };

  // Handle prediction analysis
  const handleAnalyze = async () => {
    // Validate input
    const trimmed = tweetText.trim();
    if (!trimmed) {
      setInputError("Please enter some text to analyze");
      toast.error("Please enter some text to analyze");
      return;
    }

    if (tweetText.length > 280) {
      setInputError("Tweet exceeds 280 characters");
      toast.error("Tweet exceeds 280 characters");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setInputError(null);
    setPrediction(null);

    try {
      const response = await fetch("/api/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tweetText: tweetText.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error responses with specific messaging
        if (response.status === 429) {
          // Rate limit exceeded
          const errorMsg = data.error || "Daily prediction limit exceeded. Please try again tomorrow.";
          setError(errorMsg);
          toast.error(errorMsg, {
            description: data.message || "Upgrade to get unlimited predictions!",
            duration: 5000,
          });
        } else if (response.status === 401) {
          // Authentication error
          const errorMsg = data.error || "Authentication required. Please log in again.";
          setError(errorMsg);
          toast.error(errorMsg, {
            action: {
              label: "Log In",
              onClick: () => window.location.href = "/login"
            }
          });
        } else if (response.status === 503 || response.status === 504) {
          // Network/timeout errors - show retry option
          const errorMsg = data.error || "Network error. Please check your connection and try again.";
          setError(errorMsg);
          toast.error(errorMsg, {
            action: {
              label: "Retry",
              onClick: handleAnalyze
            }
          });
        } else {
          // General errors
          const errorMsg = data.error || "Failed to generate prediction. Please try again.";
          setError(errorMsg);
          toast.error(errorMsg);
        }
        return;
      }

      // Success - set prediction data
      if (data.success && data.data) {
        setPrediction(data.data);
        toast.success("Prediction complete!", {
          description: `Virality Score: ${data.data.viralityScore}/100`
        });

        // Refresh usage indicator to show updated count
        refreshUsageIndicator();
      } else {
        const errorMsg = "Invalid response from server. Please try again.";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Prediction error:", err);
      const errorMsg = "Network error. Please check your connection and try again.";
      setError(errorMsg);
      toast.error(errorMsg, {
        action: {
          label: "Retry",
          onClick: handleAnalyze
        }
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Handle reset/try another
  const handleReset = () => {
    setTweetText("");
    setPrediction(null);
    setError(null);
    setInputError(null);
  };

  // Check if analyze button should be disabled
  const isAnalyzeDisabled =
    isAnalyzing ||
    !tweetText.trim() ||
    tweetText.length > 280 ||
    (usageData !== null && usageData.remainingToday === 0);

  return (
    <ErrorBoundary>
      <div className="container max-w-4xl mx-auto py-4 sm:py-8 px-4">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mb-2">
          Predict Post Virality
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground">
          Analyze your Twitter/X post and get insights on its viral potential
        </p>
      </div>

      {/* Usage Indicator */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="text-sm text-muted-foreground">
          Welcome, <span className="font-medium text-foreground">{user.name || user.email}</span>
        </div>
        <UsageIndicator onUsageUpdate={handleUsageUpdate} />
      </div>

      {/* Input Section */}
      <Card className="p-4 sm:p-6 mb-4 sm:mb-6">
        <div className="space-y-4">
          <div>
            <label htmlFor="tweet-input" className="block text-sm font-medium mb-2">
              Enter your post text
            </label>
            <TweetInput
              value={tweetText}
              onChange={handleTextChange}
              placeholder="What's happening?"
              disabled={isAnalyzing}
              error={inputError}
            />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-0">
            <div className="text-xs text-muted-foreground order-2 sm:order-1">
              {usageData && usageData.remainingToday === 0 ? (
                <span className="text-destructive font-medium">
                  Daily limit reached. Predictions reset daily.
                </span>
              ) : (
                <span>
                  Get AI-powered insights on your post's viral potential
                </span>
              )}
            </div>
            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              size="lg"
              className="w-full sm:w-auto sm:min-w-[140px] order-1 sm:order-2 min-h-[44px]"
            >
              {isAnalyzing ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Analyze
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>

      {/* Results Section */}
      <PredictionResult
        prediction={prediction}
        isLoading={isAnalyzing}
        error={error}
        onReset={handleReset}
        onRetry={handleAnalyze}
      />
      </div>
    </ErrorBoundary>
  );
}
