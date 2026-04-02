# CLIQ

## Current State
HomeFeedPage and MockPostCard use Tumblr-style postcards (rounded-2xl, shadow, notes bar, attribution, engagement footer). Communities and Explore still use old Card components with border-2 that do not match.

## Requested Changes (Diff)

### Add
- Tumblr-style post cards in CommunityDetailPage
- Tumblr-style user cards in ExplorePage

### Modify
- CommunityDetailPage: Replace border-2 Card post cards with Tumblr-style article elements matching MockPostCard
- CommunitiesPage: CommunityCard updated from border-2 Card to rounded-2xl shadow-sm
- ExplorePage: User result cards updated to rounded-2xl shadow-sm

### Remove
- border-2 and hover:shadow-bold on community and explore cards

## Implementation Plan
1. Update CommunityDetailPage.tsx post cards to Tumblr-style
2. Update CommunitiesPage.tsx CommunityCard styling
3. Update ExplorePage.tsx user result card styling
4. Validate
