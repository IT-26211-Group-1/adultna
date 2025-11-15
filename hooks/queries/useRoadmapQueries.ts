"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import {
  Milestone,
  CreateMilestonePayload,
  UpdateMilestonePayload,
} from "@/types/roadmap";

type ServiceResponse<T = any> = {
  success: boolean;
  message: string;
  statusCode: number;
  data?: T;
};

export function useUserMilestones() {
  return useQuery({
    queryKey: queryKeys.roadmap.milestones(),
    queryFn: async () => {
      const response = await ApiClient.get<
        ServiceResponse<{ milestones: Milestone[]; count: number }>
      >("/roadmap/milestones");

      return response.data?.milestones || [];
    },
  });
}

export function useMilestone(milestoneId?: string) {
  return useQuery({
    queryKey: queryKeys.roadmap.milestone(milestoneId!),
    queryFn: async () => {
      const response = await ApiClient.get<
        ServiceResponse<{ milestone: Milestone }>
      >(`/roadmap/milestones/${milestoneId}`);

      return response.data?.milestone;
    },
    enabled: !!milestoneId,
  });
}

export function useCreateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateMilestonePayload) => {
      const response = await ApiClient.post<
        ServiceResponse<{ milestone: Milestone }>
      >("/roadmap/milestones", data);

      return response.data?.milestone!;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}

export function useUpdateMilestone(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateMilestonePayload) => {
      const response = await ApiClient.patch<ServiceResponse>(
        `/roadmap/milestones/${milestoneId}`,
        data,
      );

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}

export function useUpdateMilestoneStatus(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      const response = await ApiClient.patch<
        ServiceResponse<{ milestoneId: string; status: string }>
      >(`/roadmap/milestones/${milestoneId}/status`, { status });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestoneId: string) => {
      await ApiClient.delete<ServiceResponse>(`/roadmap/milestones/${milestoneId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}

export function useMilestonesByStatus(status: string) {
  return useQuery({
    queryKey: queryKeys.roadmap.byStatus(status),
    queryFn: async () => {
      const response = await ApiClient.get<
        ServiceResponse<{ milestones: Milestone[]; count: number }>
      >(`/roadmap/milestones/status/${status}`);

      return response.data?.milestones || [];
    },
  });
}

export function useMilestonesByCategory(category: string) {
  return useQuery({
    queryKey: queryKeys.roadmap.byCategory(category),
    queryFn: async () => {
      const response = await ApiClient.get<
        ServiceResponse<{ milestones: Milestone[]; count: number }>
      >(`/roadmap/milestones/category/${category}`);

      return response.data?.milestones || [];
    },
  });
}

export function useUpdateTask(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      isCompleted,
    }: {
      taskId: string;
      isCompleted: boolean;
    }) => {
      const response = await ApiClient.patch<
        ServiceResponse<{ taskId: string; isCompleted: boolean }>
      >(`/roadmap/milestone/${milestoneId}/task/${taskId}`, { isCompleted });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}
