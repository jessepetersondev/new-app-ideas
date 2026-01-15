import Link from "next/link"
import { Calculator, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Counter } from "@/components/ui/counter"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Counter App",
  description: "Simple and elegant counter application with increment, decrement, and reset functionality.",
}

export default function CounterPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" asChild>
            <Link href="/" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </Button>
          <div className="flex items-center gap-2">
            <Calculator className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">Counter App</h1>
          </div>
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </div>

      {/* Main Content */}
      <main className="container mx-auto px-4">
        <div className="flex items-center justify-center min-h-[calc(100vh-12rem)]">
          <div className="w-full max-w-md">
            {/* Card wrapper for the counter */}
            <div className="bg-card border rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-bold text-card-foreground mb-2">
                  Interactive Counter
                </h2>
                <p className="text-muted-foreground">
                  Click the buttons below to increment, decrement, or reset the counter
                </p>
              </div>

              <Counter className="py-4" />

              {/* Features */}
              <div className="mt-8 pt-6 border-t">
                <div className="grid grid-cols-1 gap-2 text-sm text-muted-foreground text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Prevents negative values</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Responsive design</span>
                  </div>
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>Accessible controls</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="mt-6 text-center text-sm text-muted-foreground">
              <p>Built with Next.js, React, and shadcn/ui</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}