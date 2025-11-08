"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys, isPublicRoute } from "@/lib/apiClient";

const AUTH_CHANNEL_NAME = "auth-sync";

export function useAuthSync() {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (typeof window === "undefined" || !window.BroadcastChannel) {
      return;
    }

    const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

    channel.onmessage = (event) => {
      if (event.data.type === "LOGOUT") {
        // Clear all auth queries
        queryClient.removeQueries({ queryKey: queryKeys.auth.all });
        queryClient.setQueryData(queryKeys.auth.me(), null);

        // Only redirect to login if not on a public route
        if (!isPublicRoute(window.location.pathname)) {
          window.location.href = "/auth/login";
        }
      }

      if (event.data.type === "LOGIN") {
        // Refresh auth state
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
      }
    };

    return () => {
      channel.close();
    };
  }, [queryClient]);
}

export function broadcastLogout() {
  if (typeof window === "undefined" || !window.BroadcastChannel) {
    return;
  }

  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

  channel.postMessage({ type: "LOGOUT" });
  channel.close();
}

export function broadcastLogin() {
  if (typeof window === "undefined" || !window.BroadcastChannel) {
    return;
  }

  const channel = new BroadcastChannel(AUTH_CHANNEL_NAME);

  channel.postMessage({ type: "LOGIN" });
  channel.close();
}
