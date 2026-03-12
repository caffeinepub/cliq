# CLIQ

## Current State
HomeFeedPage renders a full PostComposer (avatar + textarea + image/video buttons + Post button) above the 3-tab feed. No scroll behavior on the composer.

## Requested Changes (Diff)

### Add
- New `FeedComposer` component: minimal bar with three zones:
  - Left: 44px orange circular `+` button that opens an animated dropdown with: Camera 📷, Video 🎥, Gallery 🖼️, Poll 📊, Schedule 📅, Auto-delete ⏰
  - Center: tappable placeholder text "What's happening on campus?" — opens existing full PostComposer in a dialog/modal
  - Right: 44px anonymous eye icon toggle (👁️), gray default, turns #FF6B35 orange when active
- Scroll behavior: FeedComposer hides when scrolling UP, reappears when scrolling DOWN. Feed tabs always stay visible.
- Dropdown animation: smooth slide-down/fade with CSS transitions.
- All icon touch targets: minimum 44x44px.

### Modify
- `HomeFeedPage`: replace inline `<PostComposer />` with the new `<FeedComposer />`. Sticky tabs below the composer. Implement scroll direction detection with a custom hook.

### Remove
- Nothing removed — existing PostComposer is kept but opened via modal from FeedComposer center tap.

## Implementation Plan
1. Create `src/frontend/src/components/posts/FeedComposer.tsx` — minimal two-button bar + center placeholder + dropdown + anonymous toggle + PostComposer dialog.
2. Update `HomeFeedPage.tsx` — use FeedComposer, add scroll direction hook, apply hide/show transition on composer, keep tabs always sticky.
