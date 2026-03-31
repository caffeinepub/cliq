# CLIQ

## Current State
- `SettingsPage.tsx` is a minimal page with only Edit Profile, Dark Mode toggle, Push Notifications toggle, and Sign Out.
- `HomeFeedPage.tsx` has 3 tabs (CLIQS, CAMPUS, EXPLORE) but no university switching logic — all 3 tabs show the same `mockPosts`. No empty state handling.
- `AppLayout.tsx` wraps content in `mx-auto max-w-2xl` correctly. `MockPostCard.tsx` uses `border-b` flush layout.
- Mock posts data has `university` field per post.

## Requested Changes (Diff)

### Add
- Full `SettingsPage` with 8 sections: Account, Security, Notifications, Appearance, Privacy, Academic, Data, About
- University switcher state in `HomeFeedPage` that controls only the CAMPUS tab
- Empty state for CAMPUS tab when no posts match selected university
- Empty state for CLIQS tab when user follows no one (show suggested users with follow buttons)
- `selectedUniversity` state in `HomeFeedPage` — passed into campus filtering logic

### Modify
- `SettingsPage.tsx` — full rewrite with all 8 sections, tappable rows with chevrons, toggle switches, orange (#FF6B35) active states and section headers, 44px touch targets, dark mode support
- `HomeFeedPage.tsx` — CAMPUS tab only shows posts matching `selectedUniversity`, CLIQS and EXPLORE tabs are unaffected by university switch; add empty states
- `AppLayout.tsx` / `HomeFeedPage.tsx` — enforce: `mx-auto max-w-2xl`, `space-y-4 mt-6`, `p-4`, `max-h-96`, `pb-20`, `w-full` on PostCard

### Remove
- Nothing removed

## Implementation Plan

1. **SettingsPage.tsx** — Complete rewrite:
   - Mobile-first, scrollable, grouped sections with orange section header text
   - Each section is a list of rows; rows are either `tappable (chevron →)` or `toggle (Switch)`
   - Sections: Account (avatar, name, email, edit profile chevron), Security (Change Password, 2FA toggle, Login History chevron), Notifications (per-type push/email toggles: likes, comments, follows, messages, digests), Appearance (Dark Mode toggle, font size selector), Privacy (Private Account toggle, Blocked Users chevron, Muted Users chevron), Academic (Department input, Year of Study — labeled as private), Data (Storage usage display, Clear Cache button, Download Data chevron, Delete Account chevron in red), About (App Version, Terms of Service chevron, Privacy Policy chevron, Contact Support chevron)
   - All rows min-height 44px for touch targets
   - Section headers in #FF6B35
   - Toggles use Switch component; active state orange
   - Dark mode fully supported

2. **HomeFeedPage.tsx** — University switching for CAMPUS tab:
   - Add `selectedUniversity` state, default to `CURRENT_USER_UNIVERSITY` ("University of Lagos")
   - Add a small university selector/pill in the CAMPUS tab header (dropdown or tap-to-change)
   - CAMPUS tab filters `mockPosts` by `post.university === selectedUniversity`
   - If filtered list is empty: show empty state 'No posts yet. Be the first to post!' with a button that opens the composer
   - CLIQS tab: always shows followed users' posts (mock + real), never changes. If empty (no follows), show 3 suggested popular users with Follow buttons
   - EXPLORE tab: always shows algorithmic posts from all universities, never changes

3. **Layout enforcement** — Ensure `MockPostCard` wrapper and `HomeFeedPage` container use the exact layout spec provided:
   - AppLayout `main > div`: `mx-auto max-w-2xl`
   - Page wrapper: `p-4`
   - Post list: `space-y-4 mt-6` (when spaced) OR `divide-y` (when flush — current)
   - PostCard: `w-full`, no overflow
   - Media: `w-full max-h-96 object-cover overflow-hidden`
   - Bottom nav clearance: `pb-20` on mobile
