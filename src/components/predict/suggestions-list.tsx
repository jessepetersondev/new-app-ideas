"use client"

import { Card } from "@/components/ui/card"

interface SuggestionsListProps {
  suggestions: string[]
}

export function SuggestionsList({ suggestions }: SuggestionsListProps) {
  if (!suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <Card className="p-4 sm:p-6">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <span className="text-xl sm:text-2xl flex-shrink-0" aria-hidden="true">
          💡
        </span>
        <h3 className="text-base sm:text-lg font-semibold">Suggestions to Improve Virality</h3>
      </div>
      <ol className="space-y-2 sm:space-y-3 list-decimal list-inside">
        {suggestions.map((suggestion, index) => (
          <li
            key={index}
            className="text-sm text-foreground leading-relaxed pl-1 sm:pl-2"
          >
            <span className="pl-1 sm:pl-2">{suggestion}</span>
          </li>
        ))}
      </ol>
    </Card>
  )
}
