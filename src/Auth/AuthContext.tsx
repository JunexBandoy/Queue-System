import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { getUser, getUserRole } from "./Auth";

type AuthState = {
  user: ReturnType<typeof getUser>;
  role: string | null;
  token: string | null;
  refresh: () => void;
  logoutLocal: () => void;
};

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const readUser = () => getUser();
  const readRole = () => getUserRole();
  const readToken = () => localStorage.getItem("token");

  const [user, setUser] = useState(readUser());
  const [role, setRole] = useState<string | null>(readRole());
  const [token, setToken] = useState<string | null>(readToken());

  const refresh = () => {
    setUser(readUser());
    setRole(readRole());
    setToken(readToken());
  };

  const logoutLocal = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    refresh();
  };

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "user" || e.key === "token") {
        refresh();
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const value = useMemo(
    () => ({ user, role, token, refresh, logoutLocal }),
    [user, role, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
