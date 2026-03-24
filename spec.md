# CLIQ

## Current State
- HomeFeedPage has 3 tabs: CLIQS, CAMPUS, EXPLORE. EXPLORE shows mockPosts with no ranking.
- ProfilePage shows ProfileHeader + 4 tabs (Posts, Replies, Media, Saved). Header has overflow issues and no URL detection in bio.
- MarketplacePage shows trending items grid with no recommendation section.
- ExplorePage shows user search with no friend recommendations.
- mockPosts.ts has engagement data (likes, comments, shares), isBoosted, timestamps.
- mockUsers.ts has user data with university info.

## Requested Changes (Diff)

### Add
- `src/frontend/src/lib/universalAlgorithm.ts` — scoring function for UNIVERSAL feed algorithm
- `src/frontend/src/lib/recommendationEngine.ts` — scoring functions for marketplace, friend, and content recommendations
- `src/frontend/src/components/recommendations/PeopleYouMayKnow.tsx` — friend recommendations UI for ExplorePage
- `src/frontend/src/components/recommendations/RecommendedForYou.tsx` — marketplace item recommendations UI
- `src/frontend/src/components/recommendations/BecauseYouLiked.tsx` — content recommendation banner for feed
- Profile bio URL detection and clickable links with 🔗 icon, orange color, hover underline, 30-char display limit

### Modify
- `HomeFeedPage.tsx` — EXPLORE tab uses UNIVERSAL algorithm to sort/score mockPosts. Remove duplicates. Add "Because you liked X" content recommendation strip in EXPLORE tab.
- `ProfilePage.tsx` — Compact mobile-friendly ProfileHeader replacement inline: avatar left, single-line stats (Posts · Following · Followers), bio with URL detection, only Posts and Media tabs (no Replies). Fix all overflow.
- `ProfileHeader.tsx` — Rewrite to be compact: smaller avatar, single-line stats row, bio text wrapping, URL → clickable anchor with 🔗 icon, 30-char ellipsis, orange color.
- `MarketplacePage.tsx` — Add "Recommended for You" section below trending items using recommendation engine scoring.
- `ExplorePage.tsx` — Add "People You May Know" section above search results using friend recommendation scoring.

### Remove
- Replies tab from ProfilePage (keep Posts, Media, Saved)

## Implementation Plan
1. Create `universalAlgorithm.ts` — scorePost(post, currentUser) returns number. Factors: recency decay (48h window, exponential), engagement score (likes×2 + comments×3 + shares×4), network boost (1.5x if followed), university boost (1.2x if same uni), boosted post (2×). Filter seen posts using sessionStorage. Sort descending by score.
2. Create `recommendationEngine.ts` — three scoring functions:
   - `scoreMarketplaceItem(item, userSearches, viewedItems)` — 40% keyword match, 30% similarity, 15% popularity, 15% recency
   - `scoreFriendRecommendation(user, currentUser, interactions)` — 30% same dept, 25% same communities, 25% post interactions, 20% profile views
   - `scoreContentRecommendation(post, likedPosts)` — tag/keyword overlap with liked posts
3. Update `ProfileHeader.tsx` — compact layout: h-16 avatar, single-line "X Posts · X Following · X Followers", bio wraps, URLs detected via regex (https?://[^\s]+), rendered as <a> with 🔗 icon, orange, 30-char truncate, new tab. Remove MapPin/Calendar icons. Fix max-w-full overflow.
4. Update `ProfilePage.tsx` — remove Replies tab, keep Posts/Media/Saved. Fix overflow with max-w-full overflow-hidden on all containers.
5. Update `HomeFeedPage.tsx` EXPLORE tab — apply universalAlgorithm to mockPosts, show sorted results. Add BecauseYouLiked strip if user has liked posts.
6. Update `MarketplacePage.tsx` — add RecommendedForYou section below trending with 10 items max, university-specific.
7. Update `ExplorePage.tsx` — add PeopleYouMayKnow section using friend recommendation scoring, 10 users max, same university.
