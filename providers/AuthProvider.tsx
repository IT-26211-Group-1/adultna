"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/hooks/useAuth";

type User = {
  id: string;
  email: string;
  role: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  logout: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
  getAccessToken: () => string | null;
  forceAuthCheck: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }

  return context;
}
