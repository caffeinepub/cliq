# CLIQ

## Current State
The app has a comprehensive Motoko backend (posts, comments, likes, follows, marketplace, messages, notifications, communities) and a React frontend with mock auth (any credentials accepted). There is basic mock data in `mockPosts.ts` (10 posts) but no centralized mock data for users, marketplace listings, communities, messages, or notifications.

## Requested Changes (Diff)

### Add
- `src/frontend/src/data/mockUsers.ts` — 8 mock Nigerian student user profiles with avatars, universities, bios, follow counts
- `src/frontend/src/data/mockMarketplace.ts` — 12 mock marketplace listings across categories (gadgets, books, furniture, beauty, food)
- `src/frontend/src/data/mockCommunities.ts` — 6 mock communities with member counts, recent posts
- `src/frontend/src/data/mockMessages.ts` — mock conversations and messages between users
- `src/frontend/src/data/mockNotifications.ts` — mock notifications (likes, follows, comments, mentions)
- Demo credentials card on the SignInPage showing 3 pre-filled test accounts users can click to auto-fill
- `DEMO_ACCOUNTS` array with email/password/profile data for 3 test users

### Modify
- `mockPosts.ts` — expand to 15 posts with richer data and cross-reference mock users
- `SignInPage.tsx` — add demo accounts section with clickable credential cards that auto-fill the form
- `SignUpPage.tsx` — add demo account hint pointing users back to sign-in

### Remove
- Nothing removed

## Implementation Plan
1. Create `mockUsers.ts` with 8 Nigerian student profiles (name, username, university, bio, avatar URL from Unsplash, follower/following counts)
2. Create `mockMarketplace.ts` with 12 listings spanning gadgets, books, furniture, beauty, food — each with image, price in Naira, seller reference, condition, university
3. Create `mockCommunities.ts` with 6 communities (Tech Hub, Campus Foodies, Marketplace, Study Group, Sports, Fashion)
4. Create `mockMessages.ts` with 3 conversations and 5–8 messages each
5. Create `mockNotifications.ts` with 10 varied notifications
6. Update `SignInPage.tsx` to show a "Demo Accounts" card with 3 clickable accounts that auto-fill email+password
7. Expand `mockPosts.ts` to 15 posts referencing mock user data
