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
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken }),
          credentials: "include",
        }
      );

      if (!res.ok) {
        logout();
        return false;
      }

      const data = await res.json();
      if (data.success && data.accessToken) {
        // Set new access token cookie manually
        const accessTokenExpiry = data.accessTokenExpiresAt
          ? new Date(data.accessTokenExpiresAt)
          : new Date(Date.now() + 15 * 60 * 1000);

        document.cookie = `access_token=${data.accessToken}; expires=${accessTokenExpiry.toUTCString()}; path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`;

        return true;
      }

      return false;
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
      return false;
    }
  };

  // Logout function
  const logout = () => {
    // Clear cookies by setting them to expire immediately
    document.cookie =
      "access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refresh_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    setAuthState({
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    router.push("/auth/login");
  };

  // Check authentication status
  const checkAuth = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));

    const accessToken = getAccessToken();

    if (!accessToken) {
      setAuthState({
        isAuthenticated: false,
        isLoading: false,
        user: null,
      });
      return false;
    }

    if (isAccessTokenExpired(accessToken)) {
      // Try to refresh token
      const refreshed = await refreshAccessToken();
      if (!refreshed) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return false;
      }

      // Get the new token after refresh
      const newAccessToken = getAccessToken();
      if (!newAccessToken) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
        });
        return false;
      }

      const user = getUserFromToken(newAccessToken);
      setAuthState({
        isAuthenticated: true,
        isLoading: false,
        user,
      });
      return true;
    }

    // Token is valid
    const user = getUserFromToken(accessToken);
    setAuthState({
      isAuthenticated: true,
      isLoading: false,
      user,
    });
    return true;
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
  };
}
