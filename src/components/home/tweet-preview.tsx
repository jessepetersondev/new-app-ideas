"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Sparkles } from "lucide-react"
import { TweetInput } from "@/components/predict/tweet-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface TweetPreviewProps {
  isAuthenticated: boolean
}

export function TweetPreview({ isAuthenticated }: TweetPreviewProps) {
  const router = useRouter()
  const [tweetText, setTweetText] = React.useState("")

  const handlePredict = () => {
    if (isAuthenticated) {
      router.push("/predict")
    } else {
      router.push("/register")
    }
  }

  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
          <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
          Try It Out
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TweetInput
          value={tweetText}
          onChange={setTweetText}
          placeholder="What's happening? Write a tweet to see how it might perform..."
          disabled={false}
        />

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
          <p className="text-sm text-muted-foreground order-2 sm:order-1">
            {isAuthenticated
              ? "Click below to get your virality prediction"
              : "Sign up to predict your tweet's virality"}
          </p>
          <Button
            onClick={handlePredict}
            disabled={!tweetText.trim()}
            size="lg"
            className="w-full sm:w-auto min-h-[44px] order-1 sm:order-2"
          >
            {isAuthenticated ? "Predict Virality" : "Sign Up to Predict"}
          </Button>
        </div>

        {!isAuthenticated && (
          <div className="text-center pt-2">
            <p className="text-xs text-muted-foreground">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-primary hover:underline font-medium min-h-[44px] inline-flex items-center"
              >
                Sign in
              </button>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
