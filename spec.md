# CLIQ — Boosted Posts Feature

## Current State
- PostCard displays posts with like, comment, share, bookmark actions
- PostComposer handles post creation with text/media
- FeedComposer is the minimal two-button composer in the home feed
- App.tsx has routes for all major pages; no /boosts route yet
- No boost functionality exists in any component
- Paystack is planned but not yet integrated

## Requested Changes (Diff)

### Add
- `BoostPostModal` component: triggered from PostCard action; shows ₦500/24h pricing, Paystack inline payment, confirms boost activation
- `BoostedPostBadge` component: non-intrusive 🚀 badge with 'Sponsored' or 'Promoted' label shown at top of boosted PostCard
- `BoostReasonLabel` component: small contextual label below author row in viewer feed (e.g. 'Popular near you', '5 people you follow liked this')
- `BoostsPage` (`/boosts`): poster's analytics dashboard showing active boosts, views count, message clicks, cost per result, boost history
- Paystack inline payment integration using `pk_test_demo` key (replaceable)
- Boost option button in PostComposer (in post creation flow, after writing content — "Boost this post" toggle/checkbox with ₦500 label)
- Route `/boosts` added to App.tsx
- Boost action button added to PostCard action row (🚀 icon, opens BoostPostModal)
- Nav link to Boosts dashboard in side drawer / PrimaryNav

### Modify
- `PostCard`: add boost badge display (if post is boosted), boost reason label (if in viewer feed), and boost action button in action row
- `PostComposer`: add optional boost toggle at bottom with ₦500/24h label that triggers Paystack after posting
- `App.tsx`: add `/boosts` route
- `PrimaryNav` / `AppLayout` side drawer: add Boosts analytics nav item

### Remove
- Nothing removed

## Implementation Plan
1. Create `src/frontend/src/lib/boostUtils.ts` — mock boost state management using localStorage (active boosts, view counts, reasons list)
2. Create `src/frontend/src/components/boosts/BoostPostModal.tsx` — payment modal with Paystack inline script loading
3. Create `src/frontend/src/components/boosts/BoostedPostBadge.tsx` — badge component
4. Create `src/frontend/src/components/boosts/BoostReasonLabel.tsx` — viewer context label
5. Create `src/frontend/src/pages/BoostsPage.tsx` — analytics dashboard
6. Update `PostCard.tsx` — add badge, reason, boost button
7. Update `PostComposer.tsx` — add boost toggle option
8. Update `App.tsx` — add /boosts route
9. Update `PrimaryNav.tsx` / `AppLayout.tsx` side drawer — add Boosts nav item
