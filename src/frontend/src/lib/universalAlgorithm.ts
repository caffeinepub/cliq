import type { MockPost } from "../data/mockPosts";

const SEEN_POSTS_KEY = "cliq_seen_posts";

function parseTimestampToHours(ts: string): number {
  const s = ts.trim().toLowerCase();
  if (s.endsWith("m")) return Number.parseFloat(s) / 60;
  if (s.endsWith("h")) return Number.parseFloat(s);
  if (s.endsWith("d")) return Number.parseFloat(s) * 24;
  return 0;
}

export function scorePost(
  post: MockPost,
  currentUserUniversity: string,
): number {
  const base = post.likes * 2 + post.comments * 3 + post.shares * 4;
  const hoursOld = parseTimestampToHours(post.timestamp);
  if (hoursOld >= 48) return 0;
  const recencyFactor = 1 - hoursOld / 48;
  let score = base * recencyFactor;
  if (post.university === currentUserUniversity) score *= 1.2;
  if (post.isBoosted) score *= 2;
  return score;
}

export function getUniversalFeed(
  posts: MockPost[],
  currentUserUniversity: string,
  seenIds?: Set<string>,
): MockPost[] {
  const seen = seenIds ?? getSeenPostIds();
  return posts
    .filter((p) => !seen.has(p.id))
    .map((p) => ({ post: p, score: scorePost(p, currentUserUniversity) }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 50)
    .map(({ post }) => post);
}

export function getSeenPostIds(): Set<string> {
  try {
    const raw = sessionStorage.getItem(SEEN_POSTS_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

export function markPostAsSeen(postId: string): void {
  try {
    const seen = getSeenPostIds();
    seen.add(postId);
    sessionStorage.setItem(SEEN_POSTS_KEY, JSON.stringify([...seen]));
  } catch {
    // ignore
  }
}
