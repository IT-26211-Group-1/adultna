"use client";

import { useEffect, useRef } from "react";
import { API_CONFIG } from "@/config/api";
import { logger } from "@/lib/logger";

const REFRESH_URL = `${API_CONFIG.API_URL}/auth/refresh-token`;
const REFRESH_BEFORE_EXPIRY = 2 * 60 * 1000; // Refresh 2 minutes before token expires

export function useTokenRefresh() {
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastRefreshRef = useRef<number>(0);

  const scheduleRefresh = (expiresAt: number) => {
    // Clear existing timer
    if (refreshTimerRef.current) {
      clearTimeout(refreshTimerRef.current);
    }

    const now = Date.now();
    const timeUntilExpiry = expiresAt - now;
    const refreshIn = timeUntilExpiry - REFRESH_BEFORE_EXPIRY;

    // Only schedule if we have enough time
    if (refreshIn > 0) {
      refreshTimerRef.current = setTimeout(async () => {
        try {
          const response = await fetch(REFRESH_URL, {
            method: "POST",
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();

            lastRefreshRef.current = Date.now();

            // Schedule next refresh
            if (data.accessTokenExpiresAt) {
              scheduleRefresh(data.accessTokenExpiresAt);
            }
          }
        } catch (error) {
          logger.error("Proactive token refresh failed:", error);
        }
      }, refreshIn);
    }
  };

  useEffect(() => {
    // Schedule initial refresh based on access token expiry (15 minutes)
    const initialExpiresAt = Date.now() + API_CONFIG.TOKEN.ACCESS_EXPIRY;

    scheduleRefresh(initialExpiresAt);

    return () => {
      if (refreshTimerRef.current) {
        clearTimeout(refreshTimerRef.current);
      }
    };
  }, []);

  return { scheduleRefresh };
}
