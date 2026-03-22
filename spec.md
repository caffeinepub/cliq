# CLIQ – FAB, Share Modal & Anonymous Rooms Redesign

## Current State
- HomeFeedPage has an inline FeedComposer that hides on scroll up
- PostCard has a Share2 icon used for Recliq (no share modal exists)
- RoomDetailPage has a basic layout mixing confessions and chat without visual distinction
- No global FAB exists; post creation only accessible from home feed

## Requested Changes (Diff)

### Add
- `FloatingActionButton` component: 56px circle, teal (#2C8A7A), + icon, fixed bottom-right (above bottom nav). Hides when scrolling down, shows when scrolling up. Exported as reusable component.
- FAB to: HomeFeedPage, ProfilePage, ExplorePage, CommunitiesPage, MarketplacePage. Each page wires FAB to appropriate modal (post composer for social pages, listing creator for marketplace).
- `ShareModal` component: triggered when user clicks the share (📤) button on PostCard. Shows: (1) Mutual followers section (avatar, display name, @username, Share button — mock 5 mutuals); (2) Other options: Copy link (clipboard), Gmail, WhatsApp, Twitter, More. Share to mutual sends to DMs (toast confirmation). Copy link copies `window.location.origin/post/:id` to clipboard.
- Separate share icon (📤 / Send icon) on PostCard action row, distinct from the Recliq infinity button.
- Confession postcards redesign in RoomDetailPage: large visually distinct cards above live chat, showing anonymous identity, content, reply count, reaction count, View Thread button that opens a threaded modal.
- ➕ button in top LEFT of room header for creating confessions (opens confession compose modal, not bottom bar).
- Top 5 Active Rooms section already exists in RoomsPage — keep and ensure it shows online counts.
- Confession thread modal: nested replies view.

### Modify
- HomeFeedPage: remove `<FeedComposer />` inline component entirely. Keep tabs sticky.
- PostCard: rename Share2/recliq button to use infinity symbol (∞) text or Infinity icon. Add new dedicated share button (Send icon) that opens ShareModal.
- RoomDetailPage: split layout clearly — confessions as postcard section at top, live chat below divider. Move ➕ confession button to header area (top left). Remove ➕ from bottom input bar. Confessions show reaction count (👍 count), reply count, View Thread button.
- RoomsPage: ensure Top 5 Active Rooms shows online user counts clearly.

### Remove
- FeedComposer inline section from HomeFeedPage header area.
- ➕ confession button from bottom input bar in RoomDetailPage.

## Implementation Plan
1. Create `src/frontend/src/components/shared/FloatingActionButton.tsx` — scroll-aware FAB component accepting `onClick` prop and optional `icon`.
2. Create `src/frontend/src/components/posts/ShareModal.tsx` — share modal with mock mutuals and external share options.
3. Update `HomeFeedPage.tsx`: remove FeedComposer, add FAB that opens PostComposer dialog.
4. Update `ProfilePage.tsx`, `ExplorePage.tsx`, `CommunitiesPage.tsx`: add FAB opening PostComposer dialog.
5. Update `MarketplacePage.tsx`: add FAB opening listing creator dialog (already exists as isCreateOpen).
6. Update `PostCard.tsx`: add share button (Send icon) opening ShareModal; keep recliq button as-is with infinity symbol.
7. Update `RoomDetailPage.tsx`: redesign confession postcard cards, move ➕ to header, add View Thread modal, add reaction counts.
