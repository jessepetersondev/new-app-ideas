import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { PredictPageClient } from "./predict-page-client";

/**
 * Predict Page - Main prediction interface
 *
 * This page is protected and requires authentication.
 * It integrates TweetInput, UsageIndicator, and PredictionResult components
 * into a functional virality prediction interface.
 */
export default async function PredictPage() {
  // Check authentication
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to login if not authenticated
  if (!session?.user) {
    redirect("/login?redirect=/predict");
  }

  // Render client component with user info
  return <PredictPageClient user={session.user} />;
}
