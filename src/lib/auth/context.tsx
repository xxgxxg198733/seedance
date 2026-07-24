"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface User {
  id: string; email: string; name: string | null; credits: number; plan: string; picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  refresh: () => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, refresh: () => {}, logout: async () => {} });

function readUserInfoCookie(): { name: string; email: string; picture: string } | null {
  try {
    const match = document.cookie.match(/(?:^|;\s*)user_info=([^;]*)/);
    if (match) {
      return JSON.parse(atob(decodeURIComponent(match[1])));
    }
  } catch {}
  return null;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      // Try API first
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          setLoading(false);
          return;
        }
      }
      // Fallback: read user_info cookie (Google OAuth)
      const info = readUserInfoCookie();
      if (info) {
        setUser({
          id: "google-user",
          email: info.email,
          name: info.name,
          picture: info.picture,
          credits: 20,
          plan: "FREE",
        });
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    document.cookie = "user_info=; max-age=0; path=/";
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, refresh, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
