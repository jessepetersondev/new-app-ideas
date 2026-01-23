# Twitter/X Post Virality Predictor - User Stories

This document breaks down the implementation plan into discrete, executable user stories for the MVP (Phase 1).

---

## Story 2: TypeScript Type Definitions
**Priority:** High
**Estimate:** Small
**Dependencies:** None

### Description
Create TypeScript interfaces for the virality prediction system including the prediction response structure, API request/response types, and usage statistics.

### Acceptance Criteria
- [ ] `ViralityPrediction` interface defines complete prediction structure
- [ ] `PredictionRequest` interface defines API input
- [ ] `PredictionResponse` interface defines API output
- [ ] `UsageStats` interface defines usage tracking data
- [ ] All factor sub-types (sentiment, hashtags, length, emojis, buzzwords) are properly typed

### Implementation Notes
- Create new types directory if it doesn't exist
- Use discriminated unions for sentiment label (positive/negative/neutral)
- Make suggestion array typed as `string[]`

### Files to Create/Modify
- `src/types/prediction.ts` - Create new file with all prediction-related types

---

## Story 3: Usage Tracking API Endpoint
**Priority:** High
**Estimate:** Small
**Dependencies:** Story 1, Story 2

### Description
Create an API endpoint that returns the current user's usage statistics including their tier, today's prediction count, and remaining predictions.

### Acceptance Criteria
- [ ] GET `/api/usage` returns user's current tier (always "free" for MVP)
- [ ] Response includes todayCount of predictions made today
- [ ] Response includes dailyLimit (3 for free tier)
- [ ] Response includes remainingToday calculation
- [ ] Endpoint requires authentication
- [ ] Returns 401 for unauthenticated requests

### Implementation Notes
- Query usageTracking table filtered by userId and today's date
- Use BetterAuth to get session and user ID
- Free tier limit is 3 predictions per day (use env var NEXT_PUBLIC_FREE_DAILY_LIMIT)

### Files to Create/Modify
- `src/app/api/usage/route.ts` - Create new GET handler

---

## Story 4: Prediction API Endpoint - Core Logic
**Priority:** High
**Estimate:** Large
**Dependencies:** Story 1, Story 2, Story 3

### Description
Create the main prediction API endpoint that accepts tweet text, calls OpenRouter AI for analysis, validates usage limits, saves results to database, and returns the virality prediction.

### Acceptance Criteria
- [ ] POST `/api/predict` accepts tweetText in request body
- [ ] Validates tweet text is not empty and under 500 characters
- [ ] Checks user's daily usage limit before processing
- [ ] Returns 429 (Too Many Requests) if daily limit exceeded
- [ ] Calls OpenRouter API with structured virality analysis prompt
- [ ] Parses AI response as JSON and validates structure
- [ ] Saves prediction to database
- [ ] Increments daily usage count
- [ ] Returns prediction with remainingPredictions count
- [ ] Endpoint requires authentication

### Implementation Notes
- Use OpenRouter with `@openrouter/ai-sdk-provider`
- Implement the detailed VIRALITY_PROMPT from the plan
- Handle AI response parsing errors gracefully
- Use transaction for saving prediction and updating usage count
- Return structured error responses with appropriate status codes

### Files to Create/Modify
- `src/app/api/predict/route.ts` - Create new POST handler

---

## Story 5: Install Required shadcn/ui Components
**Priority:** High
**Estimate:** Small
**Dependencies:** None

### Description
Install the shadcn/ui progress component and any other required UI primitives needed for the prediction interface.

### Acceptance Criteria
- [ ] Progress component is installed and available
- [ ] Textarea component is available (verify or install)
- [ ] All components work in both light and dark mode

### Implementation Notes
- Run `npx shadcn@latest add progress`
- Verify textarea component exists or install it
- Test components render correctly

### Files to Create/Modify
- `src/components/ui/progress.tsx` - Will be created by shadcn CLI
- `src/components/ui/textarea.tsx` - Verify exists or create via CLI

---

## Story 6: Tweet Input Component
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 5

### Description
Create a reusable tweet input component with character counter, visual feedback approaching the limit, and clear functionality.

### Acceptance Criteria
- [ ] Textarea accepts text input up to 280 characters
- [ ] Character counter displays current/max (e.g., "142/280")
- [ ] Counter changes color when approaching limit (250+ = warning)
- [ ] Counter changes color when at limit (280 = error/red)
- [ ] Clear button resets the input
- [ ] Component exposes value and onChange props
- [ ] Works in both light and dark mode
- [ ] Is accessible (proper labels, ARIA attributes)

### Implementation Notes
- Use controlled component pattern with value/onChange
- Use Tailwind classes for color transitions
- Consider adding subtle animation when near limit

### Files to Create/Modify
- `src/components/predict/tweet-input.tsx` - Create new component

---

## Story 7: Viral Score Gauge Component
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 5

### Description
Create a visual score gauge component that displays the viral score (0-100) with color coding and a descriptive label.

### Acceptance Criteria
- [ ] Displays score as large number (0-100)
- [ ] Shows visual progress indicator (circular or linear)
- [ ] Color coded: Red (0-33), Yellow (34-66), Green (67-100)
- [ ] Shows descriptive label: "Low", "Medium", "High", "Viral" (90+)
- [ ] Animates on initial render
- [ ] Accepts score as prop
- [ ] Works in both light and dark mode

### Implementation Notes
- Use shadcn Progress component as base or create custom circular gauge
- Use CSS transitions for smooth animation
- Consider using radial-gradient for circular gauge effect

### Files to Create/Modify
- `src/components/predict/viral-score-gauge.tsx` - Create new component

---

## Story 8: Factor Breakdown Component
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 2, Story 5

### Description
Create a component that displays the breakdown of all five virality factors with individual progress bars, scores, and brief explanations.

### Acceptance Criteria
- [ ] Displays all 5 factors: Sentiment, Hashtags, Length, Emojis, Buzzwords
- [ ] Each factor shows: icon, name, progress bar, score number, brief label
- [ ] Progress bars are color-coded based on score
- [ ] Accepts ViralityPrediction as prop
- [ ] Factors display in consistent order
- [ ] Works in both light and dark mode

### Implementation Notes
- Map over factors array for consistent rendering
- Use appropriate icons for each factor (can use emoji or icon library)
- Extract label from each factor's explanation/analysis field

### Files to Create/Modify
- `src/components/predict/factor-breakdown.tsx` - Create new component

---

## Story 9: Suggestions List Component
**Priority:** High
**Estimate:** Small
**Dependencies:** Story 2

### Description
Create a component that displays the AI-generated improvement suggestions as an actionable list.

### Acceptance Criteria
- [ ] Displays list of 3-5 suggestions
- [ ] Each suggestion is clearly readable
- [ ] Visual hierarchy with bullet points or numbers
- [ ] Accepts suggestions array as prop
- [ ] Works in both light and dark mode

### Implementation Notes
- Simple unordered or ordered list
- Consider using Card component for container
- Add lightbulb icon for visual interest

### Files to Create/Modify
- `src/components/predict/suggestions-list.tsx` - Create new component

---

## Story 10: Usage Indicator Component
**Priority:** Medium
**Estimate:** Small
**Dependencies:** Story 3

### Description
Create a component that displays the user's remaining predictions for the day with visual feedback.

### Acceptance Criteria
- [ ] Shows remaining predictions count (e.g., "2 predictions remaining today")
- [ ] Visual indicator when running low (1 remaining = warning style)
- [ ] Shows upgrade prompt when at 0 remaining
- [ ] Fetches data from /api/usage endpoint
- [ ] Works in both light and dark mode

### Implementation Notes
- Use Badge component for display
- Can be inline or standalone component
- Consider refresh after each prediction

### Files to Create/Modify
- `src/components/predict/usage-indicator.tsx` - Create new component

---

## Story 11: Prediction Result Container
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 7, Story 8, Story 9

### Description
Create a container component that combines the viral score gauge, factor breakdown, and suggestions into a cohesive results display with loading and error states.

### Acceptance Criteria
- [ ] Combines ViralScoreGauge, FactorBreakdown, and SuggestionsList
- [ ] Shows loading skeleton while prediction is processing
- [ ] Shows error state with retry option if prediction fails
- [ ] Shows empty state when no prediction yet
- [ ] Includes "Copy Results" button
- [ ] Includes "Try Another" button to reset
- [ ] Works in both light and dark mode

### Implementation Notes
- Accept prediction, isLoading, error, and onReset props
- Use Skeleton component for loading state
- Copy button should copy formatted text summary

### Files to Create/Modify
- `src/components/predict/prediction-result.tsx` - Create new component

---

## Story 12: Predict Page
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 4, Story 6, Story 10, Story 11

### Description
Create the main prediction page that integrates all prediction components into a functional interface with authentication protection.

### Acceptance Criteria
- [ ] Page is protected (requires authentication)
- [ ] Redirects to login if not authenticated
- [ ] Displays TweetInput component
- [ ] Shows UsageIndicator with remaining predictions
- [ ] "Analyze" button triggers prediction API call
- [ ] Button is disabled while loading or at usage limit
- [ ] Displays PredictionResult after successful prediction
- [ ] Handles and displays API errors appropriately
- [ ] Works in both light and dark mode
- [ ] Is mobile responsive

### Implementation Notes
- Use Server Component for auth check, Client Component for interactivity
- Manage prediction state with useState
- Use fetch or a library like SWR for API calls
- Consider adding URL state for sharing predictions (future)

### Files to Create/Modify
- `src/app/predict/page.tsx` - Create new page

---

## Story 13: Landing Page Redesign
**Priority:** High
**Estimate:** Medium
**Dependencies:** Story 6

### Description
Redesign the landing page to showcase the virality predictor with a hero section, embedded tweet input preview, "How It Works" section, and pricing teaser.

### Acceptance Criteria
- [ ] Hero section with catchy headline and subheadline
- [ ] Embedded TweetInput component (demo mode or redirect to predict)
- [ ] "Predict Virality" CTA button
- [ ] "How It Works" section with 4 steps
- [ ] Pricing teaser showing Free vs Premium tiers
- [ ] Clear CTAs: "Start Free" and "Upgrade"
- [ ] Works in both light and dark mode
- [ ] Is mobile responsive

### Implementation Notes
- Replace existing boilerplate landing page content
- For unauthenticated users, CTA should go to register/login
- For authenticated users, CTA should go to /predict
- Keep footer and basic layout structure

### Files to Create/Modify
- `src/app/page.tsx` - Redesign existing page

---

## Story 14: Site Header Navigation Update
**Priority:** Medium
**Estimate:** Small
**Dependencies:** Story 12, Story 13

### Description
Update the site header to include navigation links for the new pages and update branding.

### Acceptance Criteria
- [ ] Logo/brand name updated to "Virality Predictor" or similar
- [ ] Navigation includes: Home, Predict, Pricing links
- [ ] Predict link only visible when authenticated
- [ ] Active link is highlighted
- [ ] Mobile navigation works correctly
- [ ] Auth components (login/logout) remain functional

### Implementation Notes
- Modify existing site-header.tsx
- Use Next.js Link component for navigation
- Consider using usePathname for active state

### Files to Create/Modify
- `src/components/site-header.tsx` - Modify existing header

---

## Story 15: Error Handling and Loading States
**Priority:** Medium
**Estimate:** Small
**Dependencies:** Story 4, Story 12

### Description
Ensure comprehensive error handling and loading states throughout the prediction flow for a polished user experience.

### Acceptance Criteria
- [ ] API errors show user-friendly messages
- [ ] Rate limit errors (429) show clear "limit reached" message with upgrade prompt
- [ ] Network errors show retry option
- [ ] Loading states show appropriate feedback (spinner, skeleton)
- [ ] Form validation errors are displayed inline
- [ ] Toast notifications for success/error feedback (optional)

### Implementation Notes
- Create error boundary for unexpected errors
- Consider using sonner or similar for toast notifications
- Ensure errors don't expose sensitive information

### Files to Create/Modify
- `src/components/predict/prediction-result.tsx` - Enhance error states
- `src/app/predict/page.tsx` - Add error handling

---

## Story 16: Mobile Responsiveness Polish
**Priority:** Medium
**Estimate:** Small
**Dependencies:** Story 12, Story 13

### Description
Ensure all new components and pages are fully responsive and provide a good experience on mobile devices.

### Acceptance Criteria
- [ ] Predict page works well on mobile (< 640px)
- [ ] Landing page works well on mobile
- [ ] Tweet input is easily usable on mobile
- [ ] Score gauge and factor breakdown are readable on mobile
- [ ] Buttons are adequately sized for touch targets
- [ ] No horizontal scrolling issues

### Implementation Notes
- Test on various screen sizes using browser dev tools
- Use Tailwind responsive classes (sm:, md:, lg:)
- Consider touch-friendly spacing and sizing

### Files to Create/Modify
- Various component files - Add responsive classes as needed

---

## Story 17: Run Database Migration
**Priority:** High
**Estimate:** Small
**Dependencies:** Story 1

### Description
Generate and run the database migration to create the new tables in the PostgreSQL database.

### Acceptance Criteria
- [ ] Migration file is generated with correct schema changes
- [ ] Migration runs successfully against development database
- [ ] Tables are created with correct columns and constraints
- [ ] Indexes are created
- [ ] Can query tables from application code

### Implementation Notes
- Run `pnpm db:generate` to create migration
- Run `pnpm db:migrate` to apply migration
- Verify with `pnpm db:studio` or psql

### Files to Create/Modify
- `drizzle/` - Migration files will be auto-generated

---

## Phase 1 MVP Story Summary

| Story | Title | Priority | Size | Dependencies |
|-------|-------|----------|------|--------------|
| 1 | Database Schema | High | Small | None |
| 2 | TypeScript Types | High | Small | None |
| 3 | Usage API | High | Small | 1, 2 |
| 4 | Prediction API | High | Large | 1, 2, 3 |
| 5 | Install shadcn Components | High | Small | None |
| 6 | Tweet Input Component | High | Medium | 5 |
| 7 | Viral Score Gauge | High | Medium | 5 |
| 8 | Factor Breakdown | High | Medium | 2, 5 |
| 9 | Suggestions List | High | Small | 2 |
| 10 | Usage Indicator | Medium | Small | 3 |
| 11 | Prediction Result | High | Medium | 7, 8, 9 |
| 12 | Predict Page | High | Medium | 4, 6, 10, 11 |
| 13 | Landing Page | High | Medium | 6 |
| 14 | Header Navigation | Medium | Small | 12, 13 |
| 15 | Error Handling | Medium | Small | 4, 12 |
| 16 | Mobile Polish | Medium | Small | 12, 13 |
| 17 | Run Migration | High | Small | 1 |

---

## Recommended Implementation Order

1. **Foundation (Parallel)**
   - Story 1: Database Schema
   - Story 2: TypeScript Types
   - Story 5: Install shadcn Components

2. **Run Migration**
   - Story 17: Run Database Migration

3. **Backend APIs**
   - Story 3: Usage API
   - Story 4: Prediction API

4. **UI Components (Can be parallelized)**
   - Story 6: Tweet Input
   - Story 7: Viral Score Gauge
   - Story 8: Factor Breakdown
   - Story 9: Suggestions List
   - Story 10: Usage Indicator

5. **Integration**
   - Story 11: Prediction Result Container
   - Story 12: Predict Page
   - Story 13: Landing Page

6. **Polish**
   - Story 14: Header Navigation
   - Story 15: Error Handling
   - Story 16: Mobile Responsiveness

---

## Future Stories (Phase 2+)

These stories are not included in the MVP but are planned for future phases:

- **Subscription Table & Stripe Integration** - Add subscription schema and Stripe payment flow
- **Premium Tier Logic** - Implement unlimited predictions for premium users
- **Pricing Page** - Full pricing comparison page with Stripe checkout
- **Prediction History Page** - View past predictions (premium feature)
- **Share to Twitter** - Direct sharing integration
- **Tweet Comparison Tool** - Compare multiple tweet variants
- **Analytics Dashboard** - Track prediction trends and insights

---

*Document created: January 2026*
*Total MVP Stories: 17*
*Estimated MVP Effort: 1 day intensive development*
