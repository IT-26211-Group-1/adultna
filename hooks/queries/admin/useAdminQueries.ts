"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import { logger } from "@/lib/logger";

// Types
export type AdminUser = {
  id: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
};

export type AdminAuthMeResponse = {
  success: boolean;
  user?: AdminUser;
  message?: string;
};

export type AdminLoginRequest = {
  email: string;
  password: string;
};

export type AdminLoginResponse = {
  success: boolean;
  message?: string;
  user?: AdminUser;
  accessToken?: string;
  accessTokenExpiresAt?: number;
};

export type User = {
  id: string;
  email: string;
  emailVerified: boolean;
  status: string;
  createdAt: Date;
  lastLogin: Date | null;
  firstName: string | null;
  lastName: string | null;
  displayName: string | null;
  roleName: string | null;
};

export type CreateUserRequest = {
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role: "user" | "technical_admin" | "verifier_admin";
  emailVerified?: boolean;
  acceptedTerms?: boolean;
};

export type CreateUserResponse = {
  success: boolean;
  message: string;
  userId?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: string;
};

export type UpdateUserRequest = {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
};

export type UpdateUserResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
};

export type UpdateUserStatusRequest = {
  userId: string;
  status: "active" | "deactivated";
};

export type UpdateUserStatusResponse = {
  success: boolean;
  message: string;
  user?: {
    id: string;
    status: string;
  };
};

export type UsersListResponse = {
  success: boolean;
  users: User[];
};

export type UserDetailResponse = {
  success: boolean;
  user: User;
};

export type ReportStats = {
  totalReports: number;
  pendingReports: number;
  resolvedReports: number;
  reportsToday: number;
  reportsThisWeek: number;
};

export type ReportStatsResponse = {
  success: boolean;
  stats: ReportStats;
};

// API Functions
const adminApi = {
  me: (): Promise<AdminAuthMeResponse> => ApiClient.get("/admin/verify-token"),

  login: (data: AdminLoginRequest): Promise<AdminLoginResponse> =>
    ApiClient.post("/admin/login", data),

  logout: (): Promise<{ success: boolean; message: string }> =>
    ApiClient.post("/admin/logout"),

  // User management endpoints
  listUsers: (): Promise<UsersListResponse> =>
    ApiClient.get("/admin/list-users"),

  getUserById: (userId: string): Promise<UserDetailResponse> =>
    ApiClient.get(`/admin/get-user/${userId}`),

  createUser: (data: CreateUserRequest): Promise<CreateUserResponse> =>
    ApiClient.post("/admin/create-account", data),

  updateUser: (data: UpdateUserRequest): Promise<UpdateUserResponse> =>
    ApiClient.put(`/admin/update-account/${data.userId}`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
    }),

  updateUserStatus: (
    data: UpdateUserStatusRequest,
  ): Promise<UpdateUserStatusResponse> =>
    ApiClient.patch(`/admin/update-status/${data.userId}`, {
      status: data.status,
    }),

  // Report statistics
  getReportStats: (): Promise<ReportStatsResponse> =>
    ApiClient.get("/feedback/stats"),
};

// Query Hooks
export function useAdminAuth() {
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch: checkAuth,
  } = useQuery({
    queryKey: queryKeys.admin.auth.me(),
    enabled: true,
    queryFn: async () => {
      try {
        const response = await adminApi.me();

        if (response.success && response.user) {
          return response.user;
        }

        return null;
      } catch (error) {
        if (
          error instanceof ApiError &&
          (error.isForbidden || error.isUnauthorized)
        ) {
          return null;
        }
        throw error;
      }
    },
    staleTime: 0,
    gcTime: API_CONFIG.AUTH_QUERY.CACHE_TIME,
    refetchInterval: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
    refetchOnMount: "always",
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.isForbidden || error.isUnauthorized)
      ) {
        return false;
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
  });

  // Login Mutation
  const loginMutation = useMutation({
    mutationFn: adminApi.login,
    onSuccess: async (data) => {
      if (data.success) {
        await queryClient.invalidateQueries({
          queryKey: queryKeys.admin.auth.all,
          exact: false,
        });

        // Fetch user data
        await queryClient.refetchQueries({
          queryKey: queryKeys.admin.auth.me(),
        });
      }
    },
    onError: (error) => {
      queryClient.setQueryData(queryKeys.admin.auth.me(), null);
      logger.error("Admin login failed:", error);
    },
  });

  // Logout Mutation
  const logoutMutation = useMutation({
    mutationFn: adminApi.logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: queryKeys.admin.all });
      queryClient.setQueryData(queryKeys.admin.auth.me(), null);
      window.location.href = "/admin/login";
    },
    onError: (error) => {
      logger.error("Admin logout failed:", error);
      queryClient.removeQueries({ queryKey: queryKeys.admin.all });
      queryClient.setQueryData(queryKeys.admin.auth.me(), null);
      window.location.href = "/admin/login";
    },
  });

  // Helper functions
  const invalidateAuth = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.admin.auth.all });
  };

  const refreshAuth = () => {
    return queryClient.invalidateQueries({
      queryKey: queryKeys.admin.auth.me(),
      refetchType: "active",
    });
  };

  const updateUser = (updatedUser: Partial<AdminUser>) => {
    queryClient.setQueryData(
      queryKeys.admin.auth.me(),
      (oldUser: AdminUser | null) => {
        if (!oldUser) return null;

        return { ...oldUser, ...updatedUser };
      },
    );
  };

  const forceAuthCheck = () => checkAuth();

  const isAuthFresh = () => {
    const queryState = queryClient.getQueryState(queryKeys.admin.auth.me());

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

// User Management Hooks
export function useAdminUsers() {
  const queryClient = useQueryClient();

  // List Users Query
  const {
    data: usersData,
    isLoading: isLoadingUsers,
    error: usersError,
    refetch: refetchUsers,
  } = useQuery({
    queryKey: queryKeys.admin.users.list(),
    queryFn: adminApi.listUsers,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Create User Mutation
  const createUserMutation = useMutation({
    mutationFn: adminApi.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
    },
  });

  // Update User Mutation
  const updateUserMutation = useMutation({
    mutationFn: adminApi.updateUser,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.detail(variables.userId),
      });
    },
  });

  // Update User Status Mutation
  const updateUserStatusMutation = useMutation({
    mutationFn: adminApi.updateUserStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.users.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.users.detail(variables.userId),
      });
    },
  });

  return {
    // Data
    users: usersData?.users || [],
    usersData,

    // Loading states
    isLoadingUsers,
    isCreatingUser: createUserMutation.isPending,
    isUpdatingUser: updateUserMutation.isPending,
    isUpdatingStatus: updateUserStatusMutation.isPending,

    // Errors
    usersError,
    createUserError: createUserMutation.error,
    updateUserError: updateUserMutation.error,
    updateStatusError: updateUserStatusMutation.error,

    // Actions
    createUser: createUserMutation.mutate,
    createUserAsync: createUserMutation.mutateAsync,
    updateUser: updateUserMutation.mutate,
    updateUserAsync: updateUserMutation.mutateAsync,
    updateUserStatus: updateUserStatusMutation.mutate,
    updateUserStatusAsync: updateUserStatusMutation.mutateAsync,
    refetchUsers,

    // Mutation data
    createUserData: createUserMutation.data,
    updateUserData: updateUserMutation.data,
    updateStatusData: updateUserStatusMutation.data,
  };
}

// Individual User Hook
export function useAdminUser(userId: string) {
  const {
    data: userData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.users.detail(userId),
    queryFn: () => adminApi.getUserById(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  return {
    user: userData?.user,
    userData,
    isLoading,
    error,
    refetch,
  };
}

// Report Statistics Hook
export function useReportStats() {
  const {
    data: reportStatsData,
    isLoading: isLoadingStats,
    error: statsError,
    refetch: refetchStats,
  } = useQuery({
    queryKey: ["admin", "report-stats"],
    queryFn: adminApi.getReportStats,
    staleTime: 60 * 1000,
    gcTime: 1 * 60 * 1000, // 1 minute
    refetchInterval: 60 * 1000,
    refetchIntervalInBackground: true,
  });

  return {
    reportStats: reportStatsData?.stats,
    reportStatsData,
    isLoadingStats,
    statsError,
    refetchStats,
  };
}
