"use client";

import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";

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
  forceAuthCheck: () => Promise<boolean>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (!res.ok) return null;

    const data = await res.json();
    return data.success && data.user ? data.user : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const checkAuth = async (): Promise<boolean> => {
    setIsLoading(true);
    const fetchedUser = await fetchUser();
    setUser(fetchedUser);
    setIsLoading(false);
    return !!fetchedUser;
  };

  const forceAuthCheck = async (): Promise<boolean> => {
    return await checkAuth();
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setUser(null);
      router.push("/auth/login");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const auth: AuthContextType = {
    isAuthenticated: !!user,
    isLoading,
    user,
    logout,
    checkAuth,
    forceAuthCheck,
  };

  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
}
