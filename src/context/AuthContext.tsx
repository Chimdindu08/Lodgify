import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { api, tokenStore } from "../lib/api";
import type { AuthResponse, User } from "../lib/types";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { fullName: string; email: string; password: string; level: string }) => Promise<User>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refresh = useCallback(async () => {
    if (!tokenStore.get()) { setLoading(false); return; }
    try { setUser(await api<User>("/auth/me")); }
    catch { tokenStore.clear(); setUser(null); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void refresh(); }, [refresh]);

  async function authenticate(path: string, data: object) {
    const response = await api<AuthResponse>(path, { method: "POST", body: JSON.stringify(data) });
    tokenStore.set(response.token);
    setUser(response.user);
    return response.user;
  }

  const value = useMemo<AuthContextValue>(() => ({
    user,
    loading,
    login: (email, password) => authenticate("/auth/login", { email, password }),
    register: (data) => authenticate("/auth/register", data),
    logout: () => { tokenStore.clear(); setUser(null); },
  }), [user, loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) throw new Error("useAuth must be used inside AuthProvider");
  return value;
}
