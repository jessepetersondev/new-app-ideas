"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface ViralScoreGaugeProps {
  score: number;
  className?: string;
}

export function ViralScoreGauge({ score, className }: ViralScoreGaugeProps) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    // Animate score from 0 to target value
    const duration = 1500; // 1.5 seconds
    const steps = 60;
    const increment = score / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(increment * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [score]);

  // Determine color based on score
  const getColor = (value: number) => {
    if (value >= 67) return "text-green-600 dark:text-green-500";
    if (value >= 34) return "text-yellow-600 dark:text-yellow-500";
    return "text-red-600 dark:text-red-500";
  };

  const getGradientId = (value: number) => {
    if (value >= 67) return "greenGradient";
    if (value >= 34) return "yellowGradient";
    return "redGradient";
  };

  // Determine label based on score
  const getLabel = (value: number) => {
    if (value >= 90) return "Viral";
    if (value >= 67) return "High";
    if (value >= 34) return "Medium";
    return "Low";
  };

  // Calculate SVG circle properties - responsive sizes
  const mobileSize = 160;
  const desktopSize = 200;
  const strokeWidth = 12;

  return (
    <div className={cn("flex flex-col items-center gap-3 sm:gap-4", className)}>
      {/* Mobile gauge */}
      <div className="relative block sm:hidden">
        <svg width={mobileSize} height={mobileSize} className="transform -rotate-90">
          {/* Define gradients for each color range */}
          <defs>
            <linearGradient id="redGradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-red-500" stopColor="currentColor" />
              <stop offset="100%" className="text-red-600" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="yellowGradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-yellow-400" stopColor="currentColor" />
              <stop offset="100%" className="text-yellow-600" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="greenGradient-mobile" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-green-400" stopColor="currentColor" />
              <stop offset="100%" className="text-green-600" stopColor="currentColor" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={mobileSize / 2}
            cy={mobileSize / 2}
            r={mobileSize / 2 - strokeWidth / 2}
            strokeWidth={strokeWidth}
            className="stroke-muted fill-none"
          />

          {/* Animated progress circle */}
          <circle
            cx={mobileSize / 2}
            cy={mobileSize / 2}
            r={mobileSize / 2 - strokeWidth / 2}
            strokeWidth={strokeWidth}
            stroke={`url(#${getGradientId(score)}-mobile)`}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (mobileSize / 2 - strokeWidth / 2)}
            strokeDashoffset={2 * Math.PI * (mobileSize / 2 - strokeWidth / 2) - (animatedScore / 100) * 2 * Math.PI * (mobileSize / 2 - strokeWidth / 2)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score display in center - mobile */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={cn(
              "text-4xl font-bold tabular-nums transition-colors duration-300",
              getColor(score)
            )}
          >
            {animatedScore}
          </div>
          <div className="text-xs text-muted-foreground font-medium">
            out of 100
          </div>
        </div>
      </div>

      {/* Desktop gauge */}
      <div className="relative hidden sm:block">
        <svg width={desktopSize} height={desktopSize} className="transform -rotate-90">
          {/* Define gradients for each color range */}
          <defs>
            <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-red-500" stopColor="currentColor" />
              <stop offset="100%" className="text-red-600" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-yellow-400" stopColor="currentColor" />
              <stop offset="100%" className="text-yellow-600" stopColor="currentColor" />
            </linearGradient>
            <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" className="text-green-400" stopColor="currentColor" />
              <stop offset="100%" className="text-green-600" stopColor="currentColor" />
            </linearGradient>
          </defs>

          {/* Background circle */}
          <circle
            cx={desktopSize / 2}
            cy={desktopSize / 2}
            r={desktopSize / 2 - strokeWidth / 2}
            strokeWidth={strokeWidth}
            className="stroke-muted fill-none"
          />

          {/* Animated progress circle */}
          <circle
            cx={desktopSize / 2}
            cy={desktopSize / 2}
            r={desktopSize / 2 - strokeWidth / 2}
            strokeWidth={strokeWidth}
            stroke={`url(#${getGradientId(score)})`}
            fill="none"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * (desktopSize / 2 - strokeWidth / 2)}
            strokeDashoffset={2 * Math.PI * (desktopSize / 2 - strokeWidth / 2) - (animatedScore / 100) * 2 * Math.PI * (desktopSize / 2 - strokeWidth / 2)}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Score display in center - desktop */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={cn(
              "text-5xl font-bold tabular-nums transition-colors duration-300",
              getColor(score)
            )}
          >
            {animatedScore}
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            out of 100
          </div>
        </div>
      </div>

      {/* Label */}
      <div className="flex flex-col items-center gap-1">
        <div
          className={cn(
            "text-xl sm:text-2xl font-bold transition-colors duration-300",
            getColor(score)
          )}
        >
          {getLabel(score)}
        </div>
        <div className="text-xs sm:text-sm text-muted-foreground">
          Virality Potential
        </div>
      </div>
    </div>
  );
}
