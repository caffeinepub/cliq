# CLIQ

## Current State
- PostCard and MockPostCard have horizontal engagement buttons: Heart (like), MessageCircle (comment), ∞ (recliq), Bookmark, Send (share). Bookmark is a separate button not part of share flow.
- ShareModal shows mutuals first, then external share options. No bookmark option.
- ProfilePage has Posts/Replies/Media tabs — no Bookmarks tab.
- RoomiePage matches show match% and vibe badges but no compatibility breakdown badges.
- MockPostCard recliq button only has UI, no create-post logic.
- FeedComposer has media upload button but no preview modal before adding to post.
- Post cards have no community tags or university tags overlaid.
- No in-app retention features (mention detection, notification preferences, weekly digest view).

## Requested Changes (Diff)

### Add
- Tumblr-style engagement buttons: vertical stack layout with icon (20px) + count (16px bold) + label (11px uppercase), 4 buttons evenly spaced: Like 🔥, Comment 💬, Recliq ∞, Share 📤
- ShareModal: 'Save to Bookmarks' as first option (before mutuals and external)
- ProfilePage: Bookmarks tab showing saved posts (4th tab)
- MediaPreviewModal: when user selects image/video in composer, show preview with basic edit options (crop hint, filter labels, text overlay toggle, confirm/cancel). User must confirm before adding.
- Community tag: top-left of post card, bg #F0F0F0, dark text, 11px, for posts from communities
- University tag: top-right of post card, bg #FF6B35, white text, 11px, always shown
- Recliq functionality in MockPostCard: clicking creates a new mock post in state, shows loading state, prevents duplicate recliq, shows toast
- In-app retention features:
  - @mention detection in post composer (highlight @username as typed)
  - Notification preferences UI (accessible from notifications page or settings)
  - Weekly Digest in-app view: shows most liked post, most commented, most shared, new followers, user stats for the week

### Modify
- MockPostCard engagement row: change from horizontal pill buttons to Tumblr-style vertical column layout
- PostCard engagement row: same Tumblr-style update
- RoomiePage match cards: add compatibility breakdown badges (Budget match %, Lifestyle match %, Sleep match %) under main match %
- ShareModal: reorder — Bookmarks first, mutuals second, external last

### Remove
- Separate standalone Bookmark button from engagement row (bookmark is now accessed via Share menu)

## Implementation Plan
1. Create `TumblrEngagementBar` component — 4 vertical-stack buttons (🔥 Like, 💬 Comment, ∞ Recliq, 📤 Share), evenly spaced via flex justify-between
2. Update `MockPostCard.tsx` — use TumblrEngagementBar, add full recliq logic (mock post creation in feed state via callback or local state)
3. Update `PostCard.tsx` — use TumblrEngagementBar
4. Update `ShareModal.tsx` — add Save to Bookmarks row at top with Bookmark icon and local toast
5. Update `ProfilePage.tsx` — add Bookmarks tab (4th), show bookmarked MockPost cards
6. Create `MediaPreviewModal.tsx` — shows image/video preview, filter strip (mock labels), confirm/cancel buttons
7. Wire MediaPreviewModal into `FeedComposer.tsx` / `PostComposer.tsx`
8. Update `MockPostCard.tsx` community/university tags — top-left community pill, top-right university pill
9. Improve `RoomiePage.tsx` match cards — add Budget/Lifestyle/Sleep compatibility sub-badges
10. Create `WeeklyDigestPage.tsx` or digest section in NotificationsPage
11. Add notification preferences modal/sheet accessible from NotificationsPage
