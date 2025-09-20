"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  role: string;
}

interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
}

export function useAuth() {
  const router = useRouter();
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    isLoading: true,
    user: null,
  });

  // Get cookie value by name
  const getCookie = (name: string): string | null => {
    if (typeof window === "undefined") return null;

    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      return parts.pop()?.split(";").shift() || null;
    }
    return null;
  };

  // Get access token from cookies
  const getAccessToken = (): string | null => {
    return getCookie("access_token");
  };

  // Get refresh token from cookies
  const getRefreshToken = (): string | null => {
    return getCookie("refresh_token");
  };

  // Check if access token is expired by decoding JWT
  const isAccessTokenExpired = (token: string): boolean => {
    if (!token) return true;

    try {
      // Decode JWT payload (without verifying signature - client-side only)
      const parts = token.split(".");
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1]));
      const exp = payload.exp;

      if (!exp) return true;

      // JWT exp is in seconds, Date.now() is in milliseconds
      return Date.now() >= exp * 1000;
    } catch (error) {
      return true;
    }
  };

  // Get user info from JWT token
  const getUserFromToken = (token: string): User | null => {
    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = JSON.parse(atob(parts[1]));
      return {
        id: payload.userId,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      return null;
    }
  };

  // Refresh access token
  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/refresh-token`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        console.error("Token refresh failed with status:", res.status);
        logout();
        return false;
      }

      const data = await res.json();
      if (data.success) {
        return true;
      }

      console.error("Token refresh failed:", data.message);
      logout();
      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  const logout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Logout API call failed:", error);
    }

    // Clear any client-side data
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");

    // Clear cookies with proper settings for static deployment
    const isLocalhost =
      window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1";

    if (isLocalhost) {
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Lax";
    } else {
      document.cookie =
        "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None";
      document.cookie =
        "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=None";
    }

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    router.push("/auth/login");
  };

  // Check authentication status using server-side validation
  const checkAuth = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/me`,
        {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return false;
      }

      const data = await res.json();

      if (data.success && data.user) {
        setAuthState({
          isAuthenticated: true,
          isLoading: false,
          user: data.user,
        });
        return true;
      } else {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return false;
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      return false;
    }
  };

  // Initialize auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  return {
    ...authState,
    logout,
    checkAuth,
    getAccessToken,

    forceAuthCheck: () => {
      checkAuth();
    },
  };
}
