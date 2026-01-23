"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertCircle, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsageData {
  tier: string;
  todayCount: number;
  dailyLimit: number;
  remainingToday: number;
}

interface UsageIndicatorProps {
  onUsageUpdate?: (usage: UsageData) => void;
  className?: string;
}

export function UsageIndicator({ onUsageUpdate, className }: UsageIndicatorProps) {
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsage = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await fetch("/api/usage");

      if (!response.ok) {
        throw new Error("Failed to fetch usage data");
      }

      const data: UsageData = await response.json();
      setUsage(data);

      if (onUsageUpdate) {
        onUsageUpdate(data);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load usage data");
    } finally {
      setIsLoading(false);
    }
  }, [onUsageUpdate]);

  useEffect(() => {
    fetchUsage();
  }, [fetchUsage]);

  // Expose refresh function for parent components
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).refreshUsageIndicator = fetchUsage;
    }

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).refreshUsageIndicator;
      }
    };
  }, [fetchUsage]);

  if (isLoading) {
    return (
      <Badge variant="outline" className={className}>
        <span className="text-xs sm:text-sm">Loading...</span>
      </Badge>
    );
  }

  if (error || !usage) {
    return (
      <Badge variant="outline" className={className}>
        <AlertCircle className="mr-1 h-3 w-3 flex-shrink-0" />
        <span className="text-xs sm:text-sm">Error loading usage</span>
      </Badge>
    );
  }

  const { remainingToday } = usage;

  // Determine variant based on remaining predictions
  const getVariant = () => {
    if (remainingToday === 0) {
      return "destructive";
    }
    if (remainingToday === 1) {
      return "secondary"; // Warning style
    }
    return "default";
  };

  // Determine message based on remaining predictions
  const getMessage = () => {
    if (remainingToday === 0) {
      return "0 predictions remaining - Upgrade for more";
    }
    if (remainingToday === 1) {
      return "1 prediction remaining today";
    }
    return `${remainingToday} predictions remaining today`;
  };

  return (
    <Badge variant={getVariant()} className={className}>
      {remainingToday > 0 ? (
        <Sparkles className="mr-1 h-3 w-3 flex-shrink-0" />
      ) : (
        <AlertCircle className="mr-1 h-3 w-3 flex-shrink-0" />
      )}
      <span className="text-xs sm:text-sm">{getMessage()}</span>
    </Badge>
  );
}

// Export refresh function for external use
export function refreshUsageIndicator() {
  if (typeof window !== "undefined" && (window as any).refreshUsageIndicator) {
    (window as any).refreshUsageIndicator();
  }
}
