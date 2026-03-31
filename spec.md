# CLIQ — Profile Completion (Department & Birthday)

## Current State
CLIQ has user profiles via mock auth in localStorage. Onboarding collects name, username, email, university, and suggested follows. No department or birthday fields exist.

## Requested Changes (Diff)

### Add
- `ProfileCompletionModal` component shown after user's first post
  - Department dropdown: Arts, Sciences, Engineering, Law, Medicine, Education, Social Sciences, Business/Management, Agriculture, Pharmacy, Architecture
  - Birthday date picker (native date input or 3 selects)
  - Skip button: records skip timestamp
  - Save button: stores data + sets profile_completed_at
- `useProfileCompletion` hook managing show logic:
  - Show after first post if profile not completed
  - Re-show after 7 days if previously skipped
  - Never show during onboarding/signup
- localStorage keys: `cliq_department`, `cliq_birthday`, `cliq_profile_completed_at`, `cliq_profile_skipped_at`

### Modify
- `PostComposer.tsx`: accept optional `onPostSuccess` callback prop
- `HomeFeedPage.tsx`: use hook, render modal, pass onPostSuccess to composer

### Remove
- Nothing

## Implementation Plan
1. Create `useProfileCompletion.ts` hook
2. Create `ProfileCompletionModal.tsx` component
3. Modify `PostComposer.tsx` to accept and call `onPostSuccess`
4. Modify `HomeFeedPage.tsx` to wire everything together
