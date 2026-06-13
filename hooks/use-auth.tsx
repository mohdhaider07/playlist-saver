"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";

interface AuthContextType {
  isAuthenticated: boolean | null;
  user: { id: string; email: string; createdAt?: string | Date } | null;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
  login: (
    token: string,
    user?: { id: string; email: string; createdAt?: string | Date }
  ) => void;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: null,
  user: null,
  checkAuth: async () => {},
  logout: async () => {},
  login: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [user, setUser] = useState<{
    id: string;
    email: string;
    createdAt?: string | Date;
  } | null>(null);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
      return;
    }

    try {
      const data = await apiFetch("/api/auth/me");
      setUser(data.user);
      setIsAuthenticated(true);
    } catch {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    checkAuth();

    const handleUnauthorized = () => {
      localStorage.removeItem("token");
      setIsAuthenticated(false);
      setUser(null);
    };

    window.addEventListener("unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("unauthorized", handleUnauthorized);
  }, []);

  const logout = async () => {
    try {
      await apiFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore errors during logout
    }
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    setUser(null);
  };

  const login = (
    token: string,
    userData?: { id: string; email: string; createdAt?: string | Date }
  ) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
    if (userData) {
      setUser(userData);
    } else {
      checkAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, user, checkAuth, logout, login }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
