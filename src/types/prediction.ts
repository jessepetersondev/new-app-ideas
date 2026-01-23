/**
 * Twitter/X Post Virality Prediction Types
 *
 * This file contains all TypeScript type definitions for the virality prediction system.
 */

/**
 * Sentiment analysis result
 */
export interface SentimentFactor {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

/**
 * Hashtag analysis result
 */
export interface HashtagFactor {
  count: number;
  trending: boolean;
}

/**
 * Post length analysis result
 */
export interface LengthFactor {
  characters: number;
  optimal: boolean;
}

/**
 * Emoji analysis result
 */
export interface EmojiFactor {
  count: number;
  impact: 'high' | 'medium' | 'low';
}

/**
 * Buzzword analysis result
 */
export interface BuzzwordFactor {
  count: number;
  words: string[];
}

/**
 * Complete virality prediction result
 */
export interface ViralityPrediction {
  viralityScore: number;
  confidence: number;
  factors: {
    sentiment: SentimentFactor;
    hashtags: HashtagFactor;
    length: LengthFactor;
    emojis: EmojiFactor;
    buzzwords: BuzzwordFactor;
  };
  suggestions: string[];
}

/**
 * API request payload for virality prediction
 */
export interface PredictionRequest {
  postText: string;
}

/**
 * API response for virality prediction
 */
export interface PredictionResponse {
  success: boolean;
  data?: ViralityPrediction;
  error?: string;
}

/**
 * Usage statistics tracking data
 */
export interface UsageStats {
  totalPredictions: number;
  averageViralityScore: number;
  lastPredictionAt?: Date;
  predictionsToday: number;
  topSuggestions: Array<{
    suggestion: string;
    count: number;
  }>;
}
