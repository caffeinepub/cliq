const BOOST_STORAGE_KEY = "cliq_boosts";

interface BoostRecord {
  postId: string;
  label: "Sponsored" | "Promoted";
  boostedAt: number;
  expiresAt: number;
  views: number;
  messages: number;
  reason: string;
}

const BOOST_REASONS = [
  "Popular near you",
  "5 people you follow liked this",
  "Trending in your university",
  "People like you boosted this",
];

function loadBoosts(): Record<string, BoostRecord> {
  try {
    const raw = localStorage.getItem(BOOST_STORAGE_KEY);
    if (!raw) return {};
    const data: Record<string, BoostRecord> = JSON.parse(raw);
    // Clean up expired
    const now = Date.now();
    let changed = false;
    for (const id of Object.keys(data)) {
      if (data[id].expiresAt < now) {
        delete data[id];
        changed = true;
      }
    }
    if (changed) saveBoosts(data);
    return data;
  } catch {
    return {};
  }
}

function saveBoosts(boosts: Record<string, BoostRecord>): void {
  localStorage.setItem(BOOST_STORAGE_KEY, JSON.stringify(boosts));
}

export function isPostBoosted(postId: string): boolean {
  const boosts = loadBoosts();
  return !!boosts[postId];
}

export function boostPost(
  postId: string,
  label: "Sponsored" | "Promoted",
): void {
  const boosts = loadBoosts();
  const reason =
    BOOST_REASONS[Math.floor(Math.random() * BOOST_REASONS.length)];
  boosts[postId] = {
    postId,
    label,
    boostedAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000,
    views: 0,
    messages: 0,
    reason,
  };
  saveBoosts(boosts);
}

export function getBoostLabel(postId: string): "Sponsored" | "Promoted" | null {
  const boosts = loadBoosts();
  return boosts[postId]?.label ?? null;
}

export function getBoostReason(postId: string): string {
  const boosts = loadBoosts();
  return boosts[postId]?.reason ?? "Popular near you";
}

export function getBoostedPosts(): Array<{
  postId: string;
  label: string;
  boostedAt: number;
  views: number;
  messages: number;
  expiresAt: number;
}> {
  const boosts = loadBoosts();
  return Object.values(boosts);
}

export function incrementBoostView(postId: string): void {
  const boosts = loadBoosts();
  if (boosts[postId]) {
    boosts[postId].views += 1;
    saveBoosts(boosts);
  }
}

export function incrementBoostMessage(postId: string): void {
  const boosts = loadBoosts();
  if (boosts[postId]) {
    boosts[postId].messages += 1;
    saveBoosts(boosts);
  }
}
