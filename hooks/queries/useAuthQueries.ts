"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { API_CONFIG } from "@/config/api";

// Types
export type User = {
  id: string;
  email: string;
  role: string;
  onboardingStatus?: "not_started" | "in_progress" | "completed";
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
  accessToken?: string;
  accessTokenExpiresAt?: number;
};

// API Functions
const authApi = {
  me: (): Promise<AuthMeResponse> => ApiClient.get("/auth/me"),

  login: (data: LoginRequest): Promise<LoginResponse> =>
    ApiClient.post("/auth/login", data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    ApiClient.post("/auth/logout"),

  verifyEmail: (data: {
    otp: string;
    verificationToken: string;
  }): Promise<{ success: boolean; message: string }> =>
    ApiClient.post("/auth/verify-email", data),

  resendOtp: (data: {
    verificationToken: string;
  }): Promise<{
    success: boolean;
    message: string;
    verificationToken?: string;
    data?: { cooldownLeft: number };
  }> => ApiClient.post("/auth/resend-otp", data),
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
    enabled: true,
    queryFn: async () => {
      try {
        const response = await authApi.me();

        if (response.success && response.user) {
          const onboardingStatus =
            response.user.onboardingStatus === null ||
            response.user.onboardingStatus === undefined
              ? "not_started"
              : response.user.onboardingStatus;

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
          (error.isForbidden || error.isUnauthorized)
        ) {
          return null;
        }

        // Handle account deactivation
        if (
          error instanceof ApiError &&
          error.message?.includes("Account is not active")
        ) {
          // Import toast dynamically to avoid SSR issues
          import("@heroui/toast").then(({ addToast }) => {
            addToast({
              title: "Account Deactivated",
              description:
                "Your account has been deactivated. Please contact support for assistance.",
              color: "danger",
              timeout: 6000,
            });
          });

          return null;
        }

        throw error;
      }
    },
    staleTime: 0,
    gcTime: API_CONFIG.AUTH_QUERY.CACHE_TIME,
    refetchInterval: false,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.isForbidden || error.isUnauthorized)
      ) {
        return false;
      }

      // Don't retry on account deactivation
      if (
        error instanceof ApiError &&
        error.message?.includes("Account is not active")
      ) {
        return false;
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: async (data) => {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.auth.all,
          exact: false,
        });

        // Fetch fresh token from cookies
        await queryClient.refetchQueries({
          queryKey: queryKeys.auth.token(),
        });

        // Fetch user data
        await queryClient.refetchQueries({
          queryKey: queryKeys.auth.me(),
        });
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

    return dataAge < API_CONFIG.AUTH_QUERY.STALE_TIME;
  };

  const authState = {
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

  return authState;
}

// Email verification hooks
export function useEmailVerification() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { setSecureItem, removeSecureItem } = useSecureStorage();

  const verifyEmailMutation = useMutation({
    mutationFn: authApi.verifyEmail,
    onSuccess: async (data) => {
      removeSecureItem("verification_token");

      // Cache the user data from successful verification
      if (data.success) {
        await queryClient.invalidateQueries({ queryKey: queryKeys.auth.all });

        // Wait for auth to refresh to get onboarding status
        await queryClient.refetchQueries({ queryKey: queryKeys.auth.me() });

        const userData = queryClient.getQueryData(
          queryKeys.auth.me(),
        ) as User | null;

        if (userData?.onboardingStatus === "completed") {
          router.push("/dashboard");
        } else {
          router.push("/auth/onboarding");
        }
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
