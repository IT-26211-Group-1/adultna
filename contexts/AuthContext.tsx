"use client";

import { createContext, useContext, useEffect, useMemo, useRef } from "react";
import { setTokenProvider, setRefreshTokenCallback } from "@/lib/apiClient";
import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { API_CONFIG, isDevelopment } from "@/config/api";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthContextValue {
  token: string | null;
  expiresAt: number | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const REFRESH_URL = `${API_CONFIG.AUTH_SERVICE_URL}/refresh-token`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const tokenRef = useRef<string | null>(null);

  // Initialize token provider on mount to always read from ref
  useEffect(() => {
    setTokenProvider(() => {
      console.log("TokenProvider called, returning:", tokenRef.current ? "[PRESENT]" : "[NULL]");
      return tokenRef.current;
    });
  }, []);

  const {
    data: tokenData,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: queryKeys.auth.token(),
    queryFn: async () => {
      try {
        const response = await fetch(REFRESH_URL, {
          method: "POST",
          credentials: "include",
        });

        if (response.ok) {
          const { accessToken, accessTokenExpiresAt } = await response.json();
          return {
            accessToken,
            expiresAt: accessTokenExpiresAt,
          };
        }
      } catch (error) {
        console.error("Token refresh failed:", error);
      }
      return null;
    },
    staleTime: API_CONFIG.TOKEN.STALE_TIME,
    gcTime: API_CONFIG.TOKEN.CACHE_TIME,
    refetchInterval: API_CONFIG.TOKEN.REFRESH_INTERVAL,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    retry: false,
  });

  const contextValue = useMemo(
    () => ({
      token: tokenData?.accessToken || null,
      expiresAt: tokenData?.expiresAt || null,
      isLoading: isFetching,
    }),
    [tokenData?.accessToken, tokenData?.expiresAt, isFetching]
  );

  useEffect(() => {
    tokenRef.current = tokenData?.accessToken || null;
  }, [tokenData?.accessToken, tokenData?.expiresAt]);

  useEffect(() => {
    setRefreshTokenCallback(async () => {
      const result = await refetch();
      return result.data?.accessToken || null;
    });
  }, [refetch]);

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
