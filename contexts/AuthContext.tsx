"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useCallback,
} from "react";
import { setTokenProvider, setRefreshTokenCallback } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthContextValue {
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_URL = `${API_CONFIG.API_URL}/auth/refresh-token`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = useRef<string | null>(null);
  const initialized = useRef(false);

  const getToken = useCallback(() => {
    return null;
  }, []);

  const refreshToken = useCallback(async () => {
    try {
      const response = await fetch(REFRESH_URL, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        const { accessToken, accessTokenExpiresAt } = data;

        return {
          accessToken,
          expiresAt: accessTokenExpiresAt,
        };
      } else {
        console.log(
          "AuthContext: refresh-token endpoint failed:",
          response.status,
          response.statusText,
        );
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return null;
  }, []);

  const {
    data: tokenData,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: queryKeys.auth.token(),
    queryFn: refreshToken,
    staleTime: API_CONFIG.TOKEN.STALE_TIME,
    gcTime: API_CONFIG.TOKEN.CACHE_TIME,
    refetchInterval: API_CONFIG.TOKEN.REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: 1,
  });

  // Update ref whenever token data changes
  tokenRef.current = tokenData?.accessToken || null;

  const refreshTokenForApiClient = useCallback(async () => {
    console.log(
      "AuthContext: refreshTokenForApiClient called - using HTTP-only cookies, no manual token needed",
    );

    return null;
  }, []);

  // Initialize providers once on mount using a ref to ensure it only runs once
  if (!initialized.current) {
    setTokenProvider(getToken);
    setRefreshTokenCallback(refreshTokenForApiClient);
    initialized.current = true;
  }

  const contextValue = useMemo(
    () => ({
      token: tokenData?.accessToken || null,
      expiresAt: tokenData?.expiresAt || null,
      isLoading: isFetching,
    }),
    [tokenData?.accessToken, tokenData?.expiresAt, isFetching],
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuthToken() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuthToken must be used within AuthProvider");
  }

  return context;
}
