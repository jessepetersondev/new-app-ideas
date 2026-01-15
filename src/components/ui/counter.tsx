"use client"

import { useState } from "react"
import { Minus, Plus, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CounterProps {
  initialValue?: number
  allowNegative?: boolean
  className?: string
  step?: number
}

export function Counter({
  initialValue = 0,
  allowNegative = false,
  className,
  step = 1
}: CounterProps) {
  const [count, setCount] = useState(initialValue)

  const increment = () => setCount(prev => prev + step)

  const decrement = () =>
    setCount(prev => allowNegative ? prev - step : Math.max(0, prev - step))

  const reset = () => setCount(initialValue)

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-8", className)}>
      {/* Counter Display */}
      <div className="text-center">
        <div className="text-8xl font-bold text-primary transition-all duration-200 hover:scale-105 select-none">
          {count}
        </div>
        <div className="text-sm text-muted-foreground mt-2">
          Counter Value
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center space-x-4">
        <Button
          onClick={decrement}
          variant="destructive"
          size="lg"
          className="h-12 w-12 rounded-full"
          disabled={!allowNegative && count <= 0}
          aria-label="Decrement counter"
        >
          <Minus className="h-6 w-6" />
        </Button>

        <Button
          onClick={reset}
          variant="outline"
          size="lg"
          className="h-12 px-6"
          aria-label="Reset counter"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset
        </Button>

        <Button
          onClick={increment}
          variant="default"
          size="lg"
          className="h-12 w-12 rounded-full"
          aria-label="Increment counter"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      {/* Counter Info */}
      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
        <span>Step: {step}</span>
        {!allowNegative && <span>• Min: 0</span>}
      </div>
    </div>
  )
}