const RECLIQED_POSTS_KEY = "recliqed_posts";
const RECLIQ_COUNTS_KEY = "recliq_counts";

export function hasRecliqed(postId: string): boolean {
  try {
    const stored = localStorage.getItem(RECLIQED_POSTS_KEY);
    if (!stored) return false;
    const ids: string[] = JSON.parse(stored);
    return ids.includes(postId);
  } catch {
    return false;
  }
}

export function markRecliqed(postId: string, repostId: string): void {
  try {
    const stored = localStorage.getItem(RECLIQED_POSTS_KEY);
    const ids: string[] = stored ? JSON.parse(stored) : [];
    if (!ids.includes(postId)) {
      ids.push(postId);
      localStorage.setItem(RECLIQED_POSTS_KEY, JSON.stringify(ids));
    }
    // Also store the repost mapping
    const mapKey = `recliq_map_${postId}`;
    localStorage.setItem(mapKey, repostId);
  } catch {
    // ignore storage errors
  }
}

export function getRecliqCount(postId: string): number {
  try {
    const stored = localStorage.getItem(RECLIQ_COUNTS_KEY);
    if (!stored) return 0;
    const counts: Record<string, number> = JSON.parse(stored);
    return counts[postId] ?? 0;
  } catch {
    return 0;
  }
}

export function incrementRecliqCount(postId: string): void {
  try {
    const stored = localStorage.getItem(RECLIQ_COUNTS_KEY);
    const counts: Record<string, number> = stored ? JSON.parse(stored) : {};
    counts[postId] = (counts[postId] ?? 0) + 1;
    localStorage.setItem(RECLIQ_COUNTS_KEY, JSON.stringify(counts));
  } catch {
    // ignore storage errors
  }
}
