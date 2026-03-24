// Session-based interaction store — simple in-memory pub/sub, no external libs

let likedPostIds: string[] = [];
let followedUserIds: string[] = [];
const listeners = new Set<() => void>();

function notify() {
  for (const fn of listeners) fn();
}

export function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function addLikedPost(id: string): void {
  if (!likedPostIds.includes(id)) {
    likedPostIds = [...likedPostIds, id];
    notify();
  }
}

export function removeLikedPost(id: string): void {
  likedPostIds = likedPostIds.filter((x) => x !== id);
  notify();
}

export function getLikedPostIds(): string[] {
  return likedPostIds;
}

export function addFollowedUser(id: string): void {
  if (!followedUserIds.includes(id)) {
    followedUserIds = [...followedUserIds, id];
    notify();
  }
}

export function removeFollowedUser(id: string): void {
  followedUserIds = followedUserIds.filter((x) => x !== id);
  notify();
}

export function getFollowedUserIds(): string[] {
  return followedUserIds;
}
