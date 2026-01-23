"use client"

import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ViralityPrediction } from "@/types/prediction"

interface FactorItem {
  name: string
  icon: string
  score: number
  label: string
  color: string
}

interface FactorBreakdownProps {
  prediction: ViralityPrediction
}

function getColorClass(score: number): string {
  if (score >= 80) return "text-green-600 dark:text-green-500"
  if (score >= 60) return "text-blue-600 dark:text-blue-500"
  if (score >= 40) return "text-yellow-600 dark:text-yellow-500"
  if (score >= 20) return "text-orange-600 dark:text-orange-500"
  return "text-red-600 dark:text-red-500"
}

function getProgressColorClass(score: number): string {
  if (score >= 80) return "bg-green-600 dark:bg-green-500"
  if (score >= 60) return "bg-blue-600 dark:bg-blue-500"
  if (score >= 40) return "bg-yellow-600 dark:bg-yellow-500"
  if (score >= 20) return "bg-orange-600 dark:bg-orange-500"
  return "bg-red-600 dark:bg-red-500"
}

export function FactorBreakdown({ prediction }: FactorBreakdownProps) {
  const { factors } = prediction

  // Calculate scores for each factor (0-100 scale)
  const sentimentScore = factors.sentiment.score * 100
  const hashtagScore = factors.hashtags.trending
    ? 90
    : Math.min(factors.hashtags.count * 25, 100)
  const lengthScore = factors.length.optimal ? 90 : 50
  const emojiScore = factors.emojis.impact === 'high'
    ? 90
    : factors.emojis.impact === 'medium'
    ? 60
    : 30
  const buzzwordScore = Math.min(factors.buzzwords.count * 20, 100)

  // Create factor items array
  const factorItems: FactorItem[] = [
    {
      name: "Sentiment",
      icon: "😊",
      score: sentimentScore,
      label: `${factors.sentiment.label} tone`,
      color: getColorClass(sentimentScore)
    },
    {
      name: "Hashtags",
      icon: "#️⃣",
      score: hashtagScore,
      label: factors.hashtags.trending
        ? `${factors.hashtags.count} trending tags`
        : `${factors.hashtags.count} tags`,
      color: getColorClass(hashtagScore)
    },
    {
      name: "Length",
      icon: "📏",
      score: lengthScore,
      label: factors.length.optimal
        ? "optimal length"
        : `${factors.length.characters} chars`,
      color: getColorClass(lengthScore)
    },
    {
      name: "Emojis",
      icon: "🎨",
      score: emojiScore,
      label: `${factors.emojis.count} emojis - ${factors.emojis.impact} impact`,
      color: getColorClass(emojiScore)
    },
    {
      name: "Buzzwords",
      icon: "🔥",
      score: buzzwordScore,
      label: `${factors.buzzwords.count} buzzwords`,
      color: getColorClass(buzzwordScore)
    }
  ]

  return (
    <Card className="p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Factor Breakdown</h3>
      <div className="space-y-3 sm:space-y-4">
        {factorItems.map((factor) => (
          <div key={factor.name} className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">
                  {factor.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-sm">{factor.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{factor.label}</p>
                </div>
              </div>
              <div className={`text-base sm:text-lg font-bold flex-shrink-0 ${factor.color}`}>
                {Math.round(factor.score)}
              </div>
            </div>
            <div className="relative">
              <Progress
                value={factor.score}
                className="h-2"
              />
              <div
                className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColorClass(factor.score)}`}
                style={{ width: `${factor.score}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
