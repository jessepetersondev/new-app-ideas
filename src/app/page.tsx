import { headers } from "next/headers"
import Link from "next/link"
import { TrendingUp, BarChart3, Sparkles, Shield, CheckCircle2 } from "lucide-react"
import { TweetPreview } from "@/components/home/tweet-preview"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { auth } from "@/lib/auth"

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() })
  const isAuthenticated = !!session?.user

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4">
            <div className="inline-flex items-center justify-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-primary/10 text-primary text-xs sm:text-sm font-medium">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4" />
              AI-Powered Prediction
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight px-2">
              Predict Your Tweet&apos;s{" "}
              <span className="bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Viral Potential
              </span>
            </h1>
            <p className="text-base sm:text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto px-4">
              Get instant AI-powered insights on how your tweet will perform before you post it.
              Optimize for maximum engagement and reach.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4">
            {isAuthenticated ? (
              <>
                <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 min-h-[44px] w-full sm:w-auto">
                  <Link href="/predict">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Predict Virality
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 min-h-[44px] w-full sm:w-auto">
                  <Link href="/dashboard">View Dashboard</Link>
                </Button>
              </>
            ) : (
              <>
                <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 min-h-[44px] w-full sm:w-auto">
                  <Link href="/register">
                    <TrendingUp className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    Start Free
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="text-base sm:text-lg px-6 sm:px-8 min-h-[44px] w-full sm:w-auto">
                  <Link href="/login">Sign In</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Tweet Input Preview Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <TweetPreview isAuthenticated={isAuthenticated} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI analyzes multiple factors to predict your tweet&apos;s performance
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                    <span className="text-xl sm:text-2xl font-bold text-primary">1</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">Write Your Tweet</h3>
                  <p className="text-sm text-muted-foreground">
                    Enter your tweet text just as you would post it on X/Twitter
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                    <span className="text-xl sm:text-2xl font-bold text-primary">2</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">AI Analysis</h3>
                  <p className="text-sm text-muted-foreground">
                    Our AI evaluates engagement factors, timing, sentiment, and trends
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                    <span className="text-xl sm:text-2xl font-bold text-primary">3</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">Get Your Score</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive a virality score and detailed breakdown of key factors
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10">
                    <span className="text-xl sm:text-2xl font-bold text-primary">4</span>
                  </div>
                  <h3 className="font-semibold text-base sm:text-lg">Optimize & Post</h3>
                  <p className="text-sm text-muted-foreground">
                    Use AI suggestions to improve your tweet before posting
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center space-y-3 sm:space-y-4 mb-8 sm:mb-12 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">Simple, Transparent Pricing</h2>
            <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free and upgrade when you need more predictions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
            {/* Free Tier */}
            <Card className="relative border-2">
              <CardContent className="pt-6 space-y-5 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Free</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold">$0</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Perfect for trying out the predictor
                  </p>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">5 predictions per day</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Basic virality score</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Factor breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Usage history</span>
                  </li>
                </ul>

                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full min-h-[44px]"
                >
                  {isAuthenticated ? (
                    <Link href="/predict">Get Started</Link>
                  ) : (
                    <Link href="/register">Start Free</Link>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Premium Tier */}
            <Card className="relative border-2 border-primary">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="bg-primary text-primary-foreground px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
                  Popular
                </div>
              </div>
              <CardContent className="pt-6 space-y-5 sm:space-y-6">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold mb-2">Premium</h3>
                  <div className="flex items-baseline gap-2 mb-3 sm:mb-4">
                    <span className="text-3xl sm:text-4xl font-bold">$9</span>
                    <span className="text-muted-foreground">/month</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    For serious content creators
                  </p>
                </div>

                <ul className="space-y-2 sm:space-y-3">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm font-medium">Unlimited predictions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Advanced AI analysis</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Detailed factor breakdown</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Improvement suggestions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">Priority support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm">API access</span>
                  </li>
                </ul>

                <Button
                  asChild
                  size="lg"
                  className="w-full min-h-[44px]"
                >
                  {isAuthenticated ? (
                    <Link href="/predict">Upgrade Now</Link>
                  ) : (
                    <Link href="/register">Start Free Trial</Link>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="container mx-auto px-4 py-12 sm:py-16 md:py-24 bg-muted/30">
        <div className="max-w-4xl mx-auto text-center space-y-6 sm:space-y-8">
          <div className="space-y-3 sm:space-y-4 px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold">
              Ready to Go Viral?
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Join thousands of content creators using AI to optimize their tweets
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 px-4">
            <Button asChild size="lg" className="text-base sm:text-lg px-6 sm:px-8 min-h-[44px] w-full sm:w-auto">
              {isAuthenticated ? (
                <Link href="/predict">
                  <BarChart3 className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Predict Now
                </Link>
              ) : (
                <Link href="/register">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  Start Free
                </Link>
              )}
            </Button>
          </div>
        </div>
      </section>
    </main>
  )
}
