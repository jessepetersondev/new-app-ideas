# WinStreak Implementation Plan

## Executive Summary

WinStreak is a gamified fitness tracking application that transforms daily walking into a competitive, engaging experience. By leveraging our existing Next.js 16 tech stack with React 19, PostgreSQL, and Drizzle ORM, we'll create a viral, social fitness app that motivates users through streak-based challenges and social competition.

## Requirements Analysis

### Core Functional Requirements
1. User Authentication & Profiles
   - Social login integration
   - Profile creation with avatar
   - Step goal configuration

2. Step Tracking System
   - Background step tracking
   - Daily step goal validation
   - Streak calculation and maintenance

3. Challenge & Battle Mechanics
   - 1v1 and group challenges
   - Streak preservation/loss mechanics
   - Leaderboard system

4. Social Features
   - Friend connections
   - Challenge invitations
   - Social media sharing

5. Gamification Elements
   - Badges and achievements
   - Visual progress tracking
   - Animated win/loss states

### Non-Functional Requirements
- Performance: Low-latency step tracking
- Scalability: Support thousands of concurrent users
- Security: Protect user data and prevent cheating
- Cross-platform compatibility (web + future mobile)

## System Architecture

### High-Level Components
1. Frontend: Next.js 16 React App
2. Backend: Next.js API Routes
3. Database: PostgreSQL with Drizzle ORM
4. Authentication: Better Auth
5. Step Tracking: Web Pedometer API / Background Sync

### Data Flow
```
Mobile/Web Client → Next.js API → PostgreSQL
                  ← Realtime Updates
```

## Data Design

### Database Schema (Drizzle ORM)

```typescript
// src/lib/schema.ts
export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  username: varchar('username', { length: 50 }).unique(),
  email: varchar('email', { length: 255 }).unique(),
  avatar: varchar('avatar_url'),
  dailyStepGoal: integer('daily_step_goal').default(5000),
});

export const userSteps = pgTable('user_steps', {
  id: uuid('id').primaryKey(),
  userId: uuid('user_id').references(() => users.id),
  date: date('date').unique(),
  stepCount: integer('step_count'),
  goalAchieved: boolean('goal_achieved'),
});

export const challenges = pgTable('challenges', {
  id: uuid('id').primaryKey(),
  initiatorId: uuid('initiator_id').references(() => users.id),
  opponentId: uuid('opponent_id').references(() => users.id),
  startDate: date('start_date'),
  endDate: date('end_date'),
  status: varchar('status', {
    enum: ['PENDING', 'ACTIVE', 'COMPLETED']
  }),
});

export const streaks = pgTable('streaks', {
  userId: uuid('user_id').references(() => users.id),
  currentStreak: integer('current_streak').default(0),
  longestStreak: integer('longest_streak').default(0),
  lastStreakDate: date('last_streak_date')
});
```

## API Design

### Authentication Endpoints
- `/api/auth/register`
- `/api/auth/login`
- `/api/profile`

### Step Tracking Endpoints
- `POST /api/steps` (Log daily steps)
- `GET /api/steps/daily-progress`
- `GET /api/steps/weekly-summary`

### Challenge Endpoints
- `POST /api/challenges/create`
- `GET /api/challenges/active`
- `POST /api/challenges/accept`
- `POST /api/challenges/complete`

## UI/UX Design

### Key Screens
1. Dashboard
   - Daily step progress
   - Current streak
   - Active challenges
   - Leaderboard preview

2. Challenges Screen
   - Create/Join challenges
   - Active and past challenges
   - Challenge invite system

3. Profile Screen
   - Avatar customization
   - Step goal settings
   - Achievement showcase

4. Leaderboards
   - Friends leaderboard
   - Global leaderboard
   - Streak champions

### UI Components
- Animated streak counter
- Challenge battle UI
- Achievement badge system
- Responsive mobile-first design

## Implementation Phases

### Phase 1: Core Infrastructure (2-3 weeks)
- [ ] User authentication system
- [ ] Basic database schema
- [ ] Step tracking API
- [ ] Initial UI components

### Phase 2: Challenge Mechanics (2 weeks)
- [ ] Challenge creation system
- [ ] Streak calculation logic
- [ ] Basic leaderboard implementation

### Phase 3: Social & Gamification (2 weeks)
- [ ] Friend connection system
- [ ] Badge and achievement system
- [ ] Social sharing features

### Phase 4: Polish & Optimization (1 week)
- [ ] Performance tuning
- [ ] Extensive testing
- [ ] UX refinements

## File-by-File Implementation Guide

### Authentication
- `src/lib/auth.ts`: Extend authentication
- `src/components/auth/step-goal-setup.tsx`: New component for initial step goal

### Step Tracking
- `src/app/api/steps/route.ts`: Step logging API
- `src/hooks/use-step-tracking.ts`: Client-side step tracking hook

### Challenges
- `src/app/challenges/page.tsx`: Challenges page
- `src/components/challenges/challenge-card.tsx`: Challenge UI component
- `src/app/api/challenges/route.ts`: Challenge management API

### Leaderboards
- `src/app/leaderboard/page.tsx`: Leaderboard display
- `src/components/leaderboard/streak-champions.tsx`: Streak champions component

## Technical Considerations
- Use Web Pedometer API for step tracking
- Implement background sync for step data
- Add rate limiting to prevent cheating
- Implement client-side and server-side validation

## Monetization Strategy
- Freemium model with premium challenges
- Advanced badge system for paid users
- Optional ad integration

## Future Enhancements
- Mobile app development
- Crypto reward integration
- Machine learning fitness recommendations

## Risks & Mitigations
1. Step tracking accuracy
   - Implement multiple tracking methods
   - Allow manual step entry
2. User engagement
   - Implement daily notifications
   - Create compelling challenge mechanisms
3. Performance at scale
   - Implement efficient database indexing
   - Use caching strategies

## Conclusion
WinStreak transforms fitness tracking into an engaging, competitive experience by leveraging modern web technologies and gamification principles.