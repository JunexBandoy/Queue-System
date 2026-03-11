export type StoredUser = {
  id: number;
  name: string;
  email: string;
  role: string; // 'admin' | 'subadmin' | 'user' | etc.
};

const USER_KEY = "user";
const TOKEN_KEY = "token";

export function saveAuth(token: string, user: StoredUser) {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as StoredUser) : null;
  } catch {
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function getUserRole(): string | null {
  const u = getStoredUser();
  return u?.role ?? null;
}
