"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import { addToast } from "@heroui/toast";
import type {
  DashboardResponse,
  NotificationsResponse,
  GenerateRemindersResponse,
  DashboardSummary,
  DashboardNotification,
} from "@/types/dashboard";

const dashboardApi = {
  getSummary: () =>
    ApiClient.request<DashboardResponse>("/dashboard/summary", {
      method: "GET",
    }),

  getNotifications: (limit?: number) => {
    const endpoint = limit
      ? `/dashboard/notifications?limit=${limit}`
      : "/dashboard/notifications";

    return ApiClient.request<NotificationsResponse>(endpoint, {
      method: "GET",
    });
  },

  markNotificationRead: (notificationId: string) =>
    ApiClient.request<{ success: boolean; message: string }>(
      `/dashboard/notifications/${notificationId}/read`,
      {
        method: "PUT",
      },
    ),

  markAllNotificationsRead: () =>
    ApiClient.request<{ success: boolean; message: string }>(
      "/dashboard/notifications/read-all",
      {
        method: "PUT",
      },
    ),

  deleteNotification: (notificationId: string) =>
    ApiClient.request<{ success: boolean; message: string }>(
      `/dashboard/notifications/${notificationId}`,
      {
        method: "DELETE",
      },
    ),

  deleteAllNotifications: () =>
    ApiClient.request<{ success: boolean; message: string }>(
      "/dashboard/notifications",
      {
        method: "DELETE",
      },
    ),

  generateDeadlineReminders: () =>
    ApiClient.request<GenerateRemindersResponse>(
      "/dashboard/reminders/generate",
      {
        method: "POST",
      },
    ),
};

export function useDashboardSummary() {
  return useQuery<DashboardSummary>({
    queryKey: queryKeys.dashboard.summary(),
    queryFn: async () => {
      const response = await dashboardApi.getSummary();

      return response.data;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
}

export function useDashboardNotifications(limit?: number) {
  return useQuery<DashboardNotification[]>({
    queryKey: queryKeys.dashboard.notifications(limit),
    queryFn: async () => {
      const response = await dashboardApi.getNotifications(limit);

      return response.data;
    },
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchOnWindowFocus: true,
  });
}

export function useMarkNotificationRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      dashboardApi.markNotificationRead(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to mark notification as read",
        color: "danger",
      });
    },
  });
}

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dashboardApi.markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
      addToast({
        title: "Success",
        description: "All notifications marked as read",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to mark notifications as read",
        color: "danger",
      });
    },
  });
}

export function useDeleteNotification() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: string) =>
      dashboardApi.deleteNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete notification",
        color: "danger",
      });
    },
  });
}

export function useDeleteAllNotifications() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dashboardApi.deleteAllNotifications(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
      addToast({
        title: "Success",
        description: "All notifications deleted",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to delete notifications",
        color: "danger",
      });
    },
  });
}

export function useGenerateDeadlineReminders() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => dashboardApi.generateDeadlineReminders(),
    onSuccess: (response) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.notifications(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.dashboard.summary(),
      });
      addToast({
        title: "Success",
        description:
          response.message || "Deadline reminders generated successfully",
        color: "success",
      });
    },
    onError: (error: Error) => {
      addToast({
        title: "Error",
        description: error.message || "Failed to generate deadline reminders",
        color: "danger",
      });
    },
  });
}
