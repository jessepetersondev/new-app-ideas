# Counter App 2 - Implementation Plan

## Executive Summary

We will implement a simple Counter App as a standalone feature in our Next.js 16 boilerplate, demonstrating best practices for UI component design, state management, and user interaction.

## Requirements Analysis

### Functional Requirements
- Display a number starting at 0
- Increment button to increase the counter
- Decrement button to decrease the counter
- Reset button to return to 0

### Non-Functional Requirements
- Responsive design
- Dark/light mode support
- TypeScript type safety
- Tailwind CSS styling
- Accessibility compliance

## System Architecture

### Component Structure
```
/src
├── components/
│   └── counter/
│       ├── counter.tsx           # Main counter component
│       └── counter-controls.tsx  # Increment/decrement/reset buttons
├── app/
│   └── counter/
│       └── page.tsx              # Counter page
```

### State Management
- Use React `useState` for local state management
- Consider `useReducer` if complexity increases
- Optional: Persist counter state in localStorage

## Data Design

### Counter State Interface
```typescript
interface CounterState {
  value: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}
```

## API Design
- No backend API required for simple counter
- Potential future extensions:
  - Persist counter in database
  - Multi-user counter
  - Leaderboard functionality

## UI/UX Design

### Component: `/src/components/counter/counter.tsx`
- Centered card-style layout
- Large, clear number display
- Buttons with clear, distinct styling
- Support dark/light mode themes
- Accessibility attributes (aria-label)

### Button Variants
- Increment: Positive, green-tinted button
- Decrement: Destructive, red-tinted button
- Reset: Neutral, grey button

## Implementation Phases

### Phase 1: Setup and Component Creation
1. Create `counter` directory in `src/components`
2. Implement `counter.tsx` with base state management
3. Create `counter-controls.tsx` for button interactions
4. Add prop types and initial TypeScript interfaces

### Phase 2: Styling and Theming
1. Use shadcn/ui Button component as base
2. Apply Tailwind CSS utility classes
3. Add dark mode support with `:dark` variants
4. Implement responsive design

### Phase 3: Page Integration
1. Create `/src/app/counter/page.tsx`
2. Add routing and page-level layout
3. Implement server-side rendering considerations
4. Add page metadata and SEO optimization

### Phase 4: Testing and Refinement
1. Write unit tests for counter logic
2. Add accessibility testing
3. Verify dark/light mode transitions
4. Perform cross-browser testing

## File-by-File Implementation Guide

### 1. `/src/components/counter/counter.tsx`
```typescript
"use client"
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Counter() {
  const [count, setCount] = useState(0);

  const increment = () => setCount(prev => prev + 1);
  const decrement = () => setCount(prev => Math.max(0, prev - 1));
  const reset = () => setCount(0);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Simple Counter</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center space-y-4">
        <div
          className="text-6xl font-bold tabular-nums"
          aria-live="polite"
          aria-atomic="true"
        >
          {count}
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={increment}
            aria-label="Increment counter"
          >
            +
          </Button>
          <Button
            variant="destructive"
            onClick={decrement}
            aria-label="Decrement counter"
            disabled={count === 0}
          >
            -
          </Button>
          <Button
            variant="secondary"
            onClick={reset}
            aria-label="Reset counter"
            disabled={count === 0}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
```

### 2. `/src/app/counter/page.tsx`
```typescript
import { Counter } from "@/components/counter/counter";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Simple Counter App",
  description: "A demo counter application with increment, decrement, and reset features"
};

export default function CounterPage() {
  return (
    <div className="container mx-auto py-10">
      <Counter />
    </div>
  );
}
```

## Verification Checklist
- [ ] Counter displays initial value of 0
- [ ] Increment button increases value
- [ ] Decrement button reduces value (stops at 0)
- [ ] Reset button returns to 0
- [ ] Dark/light mode transitions work correctly
- [ ] Responsive on mobile and desktop
- [ ] Passes accessibility checks
- [ ] Passes `npm run lint && npm run typecheck`

## Optional Future Enhancements
1. Persist counter state in localStorage
2. Add animation for value changes
3. Implement multi-counter functionality
4. Add counter history/log
5. Create shareable counter links

## Development Commands
```bash
# Start development server
npm run dev

# Check code quality
npm run lint
npm run typecheck

# Build for production
npm run build
```