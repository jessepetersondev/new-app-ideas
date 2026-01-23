"use client"

import * as React from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const TWEET_MAX_LENGTH = 280
const WARNING_THRESHOLD = 250

interface TweetInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: string | null
}

export function TweetInput({
  value,
  onChange,
  placeholder = "What's happening?",
  className,
  disabled = false,
  error = null,
}: TweetInputProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null)
  const characterCount = value.length
  const remainingCharacters = TWEET_MAX_LENGTH - characterCount
  const isAtLimit = characterCount >= TWEET_MAX_LENGTH
  const isNearLimit = characterCount >= WARNING_THRESHOLD && !isAtLimit
  const hasError = Boolean(error)

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value
    // Only allow changes if under the limit
    if (newValue.length <= TWEET_MAX_LENGTH) {
      onChange(newValue)
    }
  }

  const handleClear = () => {
    onChange("")
    textareaRef.current?.focus()
  }

  // Get counter color based on character count
  const getCounterColor = () => {
    if (isAtLimit) {
      return "text-destructive"
    }
    if (isNearLimit) {
      return "text-orange-500 dark:text-orange-400"
    }
    return "text-muted-foreground"
  }

  // Auto-resize textarea
  React.useEffect(() => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [value])

  return (
    <div className={cn("space-y-2", className)}>
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          aria-label="Tweet text input"
          aria-describedby="character-counter"
          aria-invalid={isAtLimit}
          className={cn(
            "min-h-[120px] w-full resize-none rounded-md border border-input bg-background px-3 sm:px-4 py-3 text-base sm:text-base",
            "placeholder:text-muted-foreground",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            "disabled:cursor-not-allowed disabled:opacity-50",
            "transition-colors",
            isAtLimit && "border-destructive focus-visible:ring-destructive",
            hasError && "border-destructive focus-visible:ring-destructive"
          )}
          rows={1}
        />
        {value && !disabled && (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-2 top-2 h-8 w-8 sm:h-6 sm:w-6 rounded-full opacity-70 hover:opacity-100 min-h-[44px] sm:min-h-0"
            aria-label="Clear tweet text"
          >
            <X className="h-5 w-5 sm:h-4 sm:w-4" />
          </Button>
        )}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
        <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
          <div
            id="character-counter"
            className={cn(
              "text-sm font-medium transition-colors",
              getCounterColor()
            )}
            aria-live="polite"
            aria-atomic="true"
          >
            <span className={cn(isNearLimit && "animate-pulse")}>
              {characterCount}
            </span>
            <span className="text-muted-foreground">/</span>
            <span>{TWEET_MAX_LENGTH}</span>
          </div>

          {hasError && (
            <div className="text-xs text-destructive font-medium flex items-center gap-1">
              <AlertCircle className="h-3 w-3 flex-shrink-0" />
              <span className="break-words">{error}</span>
            </div>
          )}
        </div>

        {isNearLimit && !hasError && (
          <div className="text-xs text-muted-foreground">
            {remainingCharacters === 0 ? (
              <span className="font-medium text-destructive">
                Character limit reached
              </span>
            ) : (
              <span>
                {remainingCharacters} character{remainingCharacters !== 1 ? "s" : ""} remaining
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
