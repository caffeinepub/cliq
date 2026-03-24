import type { MockListing } from "../data/mockMarketplace";
import type { MockPost } from "../data/mockPosts";
import type { MockUser } from "../data/mockUsers";

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash) / 0xffffffff;
}

export function scoreMarketplaceItem(
  item: MockListing,
  searchHistory: string[],
  viewedIds: string[],
): number {
  const titleLower = item.title.toLowerCase();
  const categoryLower = item.category.toLowerCase();

  const keywordScore =
    searchHistory.length > 0
      ? searchHistory.some(
          (kw) =>
            titleLower.includes(kw.toLowerCase()) ||
            categoryLower.includes(kw.toLowerCase()),
        )
        ? 0.4
        : 0
      : 0.2;

  const viewedCategories = viewedIds.map((id) => id.toLowerCase());
  const similarityScore = viewedCategories.some((vc) =>
    categoryLower.includes(vc),
  )
    ? 0.3
    : 0.1;

  const popularityScore = (item.rating / 5.0) * 0.15;

  const ageHours = item.timestamp.includes("h")
    ? Number.parseFloat(item.timestamp)
    : item.timestamp.includes("d")
      ? Number.parseFloat(item.timestamp) * 24
      : 0.5;
  const recencyScore = Math.max(0, (1 - ageHours / 168) * 0.15);

  return keywordScore + similarityScore + popularityScore + recencyScore;
}

export function scoreFriendRecommendation(
  candidate: MockUser,
  currentUserUniversity: string,
  likedUsernames: string[],
  followedUserIds: string[] = [],
): number {
  const uniScore = candidate.university === currentUserUniversity ? 0.3 : 0;
  const interactionScore = likedUsernames.includes(candidate.username)
    ? 0.25
    : 0;
  const followBoost = followedUserIds.includes(candidate.id) ? 0.15 : 0;
  const interactionRand =
    hashString(`${candidate.username}_interaction`) * 0.25;
  const viewRand = hashString(`${candidate.username}_views`) * 0.2;
  return uniScore + interactionScore + followBoost + interactionRand + viewRand;
}

export function getContentRecommendations(
  allPosts: MockPost[],
  likedPostIds: string[],
  limit = 4,
): { triggerPost: MockPost; recommendations: MockPost[] } | null {
  if (likedPostIds.length === 0) return null;

  const likedPosts = allPosts.filter((p) => likedPostIds.includes(p.id));
  if (likedPosts.length === 0) return null;

  const triggerPost = likedPosts[0];
  const triggerWords = triggerPost.content
    .toLowerCase()
    .split(/\s+/)
    .filter((w) => w.length > 4);

  const recommendations = allPosts
    .filter((p) => !likedPostIds.includes(p.id) && p.id !== triggerPost.id)
    .map((p) => {
      const words = p.content.toLowerCase().split(/\s+/);
      const overlap = triggerWords.filter((w) => words.includes(w)).length;
      return { post: p, overlap };
    })
    .filter(({ overlap }) => overlap > 0)
    .sort((a, b) => b.overlap - a.overlap)
    .slice(0, limit)
    .map(({ post }) => post);

  if (recommendations.length === 0) return null;
  return { triggerPost, recommendations };
}
