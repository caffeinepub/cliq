# CLIQ Onboarding Flow

## Current State
Unauthenticated users see `SignedOutLanding.tsx` (a marketing page with Sign In / Get Started buttons). The `/signup` route shows a standard form page (`SignUpPage.tsx`). Auth is mock-based via `useMockAuth.ts` / `setMockUser()`. No multi-step onboarding exists.

## Requested Changes (Diff)

### Add
- `OnboardingFlow.tsx` — full-screen 5-step slide-based onboarding component
  - Step 0 (Splash): CLIQ logo centered on orange background, "tap anywhere to start" hint, tap → slides to Step 1
  - Step 1 (Sign Up): Email, username, password fields. Slides in from top (slides down). No account created yet — data stored in local state.
  - Step 2 (University Selection): Searchable list of 5 universities (UNILAG, UI, UNN, OAU, ABU) with popular badge. Search input at top, list below.
  - Step 3 (Follow People): Grid of suggested accounts (Student Union, Textbook Exchange, Roomie Finder, Campus Foodies, Study Buddy, Night Market). Each has a follow toggle button. Skip option at bottom.
  - Step 4 (Feed): Onboarding complete — creates mock user account, navigates to `/`, shows welcome toast.
- Slide transitions: 0.4s cubic-bezier(0.4, 0, 0.2, 1), each step slides from right except Step 1 which slides from top. Back navigation reverses the transition.
- Progress indicator dots at the top (steps 1–3 only, not splash).
- Back button on steps 1–3.

### Modify
- `AuthGate.tsx` — when user is unauthenticated AND not on `/signin` or `/signup`, render `<OnboardingFlow />` instead of `<SignedOutLanding />`.
- `SignedOutLanding.tsx` can remain but will no longer be the primary entry point for new users.

### Remove
- Nothing removed; existing sign-in/signup pages remain for direct URL access.

## Implementation Plan
1. Create `src/frontend/src/components/onboarding/OnboardingFlow.tsx` with 5 steps, slide animations via CSS transitions, and local state for all form data.
2. On final step, call `setMockUser()` with collected data, navigate to `/`, show welcome toast.
3. Update `AuthGate.tsx` to render `<OnboardingFlow />` instead of `<SignedOutLanding />` for unauthenticated users.
