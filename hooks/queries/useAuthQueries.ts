"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { useSecureStorage } from "@/hooks/useSecureStorage";

// Types
export type User = {
  id: string;
  email: string;
  role: string;
  onboardingStatus?: "not_started" | "in_progress" | "completed";
  onboardingCompleted?: boolean; // Computed property for backward compatibility
};

export type AuthMeResponse = {
  success: boolean;
  user?: User;
  message?: string;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  success: boolean;
  message?: string;
  verificationToken?: string;
  user?: User;
  data?: { cooldownLeft: number };
};

// API Functions
const authApi = {
  me: (): Promise<AuthMeResponse> => ApiClient.get("/auth/me"),

  login: (data: LoginRequest): Promise<LoginResponse> =>
    ApiClient.post("/login", data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    ApiClient.post("/logout"),

  verifyEmail: (data: {
    otp: string;
    verificationToken: string;
  }): Promise<{ success: boolean; message: string }> =>
    ApiClient.post("/verify-email", data),

  resendOtp: (data: {
    verificationToken: string;
  }): Promise<{
    success: boolean;
    message: string;
    verificationToken?: string;
    data?: { cooldownLeft: number };
  }> => ApiClient.post("/resend-otp", data),
};

// Query Hooks
export function useAuth() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setSecureItem } = useSecureStorage();

  const {
    data: user,
    isLoading,
    error,
    refetch: checkAuth,
  } = useQuery({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      try {
        const response = await authApi.me();

        if (response.success && response.user) {
          // Default onboardingStatus to "not_started" if missing
          const onboardingStatus =
            response.user.onboardingStatus || "not_started";

          // Add computed onboardingCompleted property for backward compatibility
          const user = {
            ...response.user,
            onboardingStatus,
            onboardingCompleted: onboardingStatus === "completed",
          };

          return user;
        }

        return null;
      } catch (error) {
        if (
          error instanceof ApiError &&
          (error.isUnauthorized || error.isForbidden)
        ) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 15 * 60 * 1000, // 15 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
    refetchInterval: (query) => {
      return query.state.data ? 15 * 60 * 1000 : false; // 15 minutes
    },
    refetchOnWindowFocus: (query) => {
      return !query.state.data || query.isStale();
    },
    refetchOnMount: (query) => {
      return query.isStale();
    },
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.isUnauthorized || error.isForbidden)
      ) {
        return false;
      }

      return failureCount < 2;
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      if (data.success) {
        queryClient.setQueryData(queryKeys.auth.me(), data.user);
        await new Promise((r) => setTimeout(r, 300));
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });

        router.replace("/dashboard");
      }
    },
    onError: (error) => {
      queryClient.setQueryData(queryKeys.auth.me(), null);

      // email verification
      if (
        error instanceof ApiError &&
        error.message === "Please verify your email first"
      ) {
        if (error.data?.verificationToken) {
          setSecureItem("verification_token", error.data.verificationToken, 60);
        }

        setTimeout(() => {
          router.replace("/auth/verify-email");
        }, 0);
      }
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.setQueryData(queryKeys.auth.me(), null);
      window.location.href = "/auth/login";
    },
    onError: (error) => {
      console.error("Logout failed:", error);
      queryClient.removeQueries({ queryKey: queryKeys.auth.all });
      queryClient.setQueryData(queryKeys.auth.me(), null);
      window.location.href = "/auth/login";
    },
  });

  // Helper functions
  const invalidateAuth = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });
  };

  const refreshAuth = () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.auth.me(),
      refetchType: "active",
    });
  };

  const updateUser = (updatedUser: Partial<User>) => {
    queryClient.setQueryData(queryKeys.auth.me(), (oldUser: User | null) => {
      if (!oldUser) return null;

      return { ...oldUser, ...updatedUser };
    });
  };

  const forceAuthCheck = () => checkAuth();

  const isAuthFresh = () => {
    const queryState = queryClient.getQueryState(queryKeys.auth.me());

    if (!queryState?.dataUpdatedAt) return false;

    const now = Date.now();
    const dataAge = now - queryState.dataUpdatedAt;

    return dataAge < 15 * 60 * 1000;
  };

  return {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,

    // Mutations
    login: loginMutation.mutate,
    loginAsync: loginMutation.mutateAsync,
    logout: logoutMutation.mutate,

    // Mutation state
    isLoggingIn: loginMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,

    // Utilities
    checkAuth,
    forceAuthCheck,
    refreshAuth,
    invalidateAuth,
    updateUser,
    isAuthFresh,
  };
}

// Email verification hooks
export function useEmailVerification() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setSecureItem, removeSecureItem } = useSecureStorage();

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: (data) => {
      removeSecureItem("verification_token");

      // Cache the user data from successful verification
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

        router.push("/auth/onboarding");
      }
    },
  });

  const resendOtpMutation = useMutation({
    mutationFn: authApi.resendOtp,
    onSuccess: (response) => {
      if (response.verificationToken) {
        setSecureItem("verification_token", response.verificationToken, 60);
      }
    },
  });

  return {
    // Mutations
    verifyEmail: verifyEmailMutation.mutate,
    resendOtp: resendOtpMutation.mutate,
    resendOtpAsync: resendOtpMutation.mutateAsync,

    // State
    isVerifying: verifyEmailMutation.isPending,
    isResending: resendOtpMutation.isPending,
    verifyError: verifyEmailMutation.error,
    resendError: resendOtpMutation.error,

    // Data
    lastResendResponse: resendOtpMutation.data,
  };
}
