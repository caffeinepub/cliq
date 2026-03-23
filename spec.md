# CLIQ Roomie Landing Page

## Current State
CLIQ is a full-stack Nigerian campus platform with a Roomie matching feature embedded inside the app. There is no standalone public-facing landing page for the Roomie feature.

## Requested Changes (Diff)

### Add
- A standalone `/roomie` landing page (or replace the existing Roomie page) with:
  - Hero section: headline, subhead, CTA button, trust badges, match card visual
  - Features section: 3-column grid
  - How It Works: 3-step flow
  - FAQ: 4 accordion questions
  - Placeholder for testimonials (no fake ones)

### Modify
- Route the Roomie nav link to the new landing page

### Remove
- Nothing removed from existing app

## Implementation Plan
1. Create `RoomieLandingPage.tsx` with all sections
2. Match card visual showing 96% match with Sarah, budget/sleep/vibes tags
3. Trust badges with student count and university count
4. 3-column features section
5. 3-step How It Works
6. FAQ accordion (4 questions)
7. 'Real student stories coming soon' placeholder instead of testimonials
8. CTA button styled in #FF6B35 orange
9. Wire route in App.tsx
