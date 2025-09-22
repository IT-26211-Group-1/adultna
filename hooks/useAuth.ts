"use client";

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

export type User = {
  id: string;
  email: string;
  role: string;
  onboardingCompleted?: boolean;
};

export type AuthMeResponse = {
  success: boolean;
  user?: User;
  message?: string;
};

// Auth API functions
async function fetchUser(): Promise<User | null> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) return null;

    const response: AuthMeResponse = await res.json();
    return response.success && response.user ? response.user : null;
  } catch {
    return null;
  }
}

async function logoutUser(): Promise<void> {
  try {
    await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/logout`, {
      method: "POST",
      credentials: "include",
    });
  } catch (error) {
    console.error("Logout failed:", error);
  }
}

// Auth Query Hook
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();

  // Main auth query - this replaces the old useEffect in AuthProvider
  const {
    data: user,
    isLoading,
    error,
    refetch: checkAuth,
  } = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: fetchUser,
    staleTime: 5 * 60 * 1000, // 5 minutes - don't refetch if data is fresh
    retry: (failureCount, error) => {
      // Don't retry on 401/403 errors (unauthorized)
      if (error && typeof error === 'object' && 'status' in error) {
        const status = (error as any).status;
        if (status === 401 || status === 403) return false;
      }
      return failureCount < 2;
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      // Clear all auth-related queries
      queryClient.clear();
      // Force a full page refresh to clear all state
      window.location.href = "/auth/login";
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      // Still redirect even if logout fails
      window.location.href = "/auth/login";
    },
  });

  // Force auth check (useful after login/register)
  const forceAuthCheck = () => {
    return checkAuth();
  };

  // Invalidate auth cache (useful after profile updates)
  const invalidateAuth = () => {
    queryClient.invalidateQueries({ queryKey: ['auth'] });
  };

  // Update user in cache (optimistic updates)
  const updateUser = (updatedUser: Partial<User>) => {
    queryClient.setQueryData(['auth', 'me'], (oldUser: User | null) => {
      if (!oldUser) return null;
      return { ...oldUser, ...updatedUser };
    });
  };

  return {
    // State
    user,
    isAuthenticated: !!user,
    isLoading,
    error,

    // Actions
    logout: () => logoutMutation.mutate(),
    checkAuth: forceAuthCheck,
    forceAuthCheck,
    invalidateAuth,
    updateUser,

    // Mutation state
    isLoggingOut: logoutMutation.isPending,
  };
}