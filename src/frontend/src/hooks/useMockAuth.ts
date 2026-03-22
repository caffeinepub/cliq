/**
 * Mock authentication hook — uses localStorage to persist a fake user session.
 * Used while Supabase Auth is not yet wired into this IC canister environment.
 */

export interface MockUser {
  id: string;
  email: string;
  username: string;
  displayName: string;
  university: string;
}

const STORAGE_KEY = "cliq_mock_user";

export function getMockUser(): MockUser | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as MockUser) : null;
  } catch {
    return null;
  }
}

export function setMockUser(user: MockUser): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
}

export function clearMockUser(): void {
  localStorage.removeItem(STORAGE_KEY);
}

export function useMockAuth() {
  const user = getMockUser();
  return {
    user,
    isAuthenticated: !!user,
    signOut: clearMockUser,
  };
}
