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
    onMutate: async (milestoneId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones()
      );

      if (previousMilestones) {
        queryClient.setQueryData<Milestone[]>(
          queryKeys.roadmap.milestones(),
          previousMilestones.filter((milestone) => milestone.id !== milestoneId)
        );
      }

      return { previousMilestones };
    },
    onError: (_error, _milestoneId, context) => {
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones
        );
      }
    },
    onSuccess: (_data, milestoneId) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
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
    onMutate: async ({ taskId, isCompleted }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestone = queryClient.getQueryData<Milestone>(
        queryKeys.roadmap.milestone(milestoneId)
      );
      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones()
      );

      if (previousMilestone) {
        queryClient.setQueryData<Milestone>(
          queryKeys.roadmap.milestone(milestoneId),
          {
            ...previousMilestone,
            tasks: previousMilestone.tasks.map((task) =>
              task.id === taskId ? { ...task, completed: isCompleted } : task
            ),
          }
        );
      }

      if (previousMilestones) {
        queryClient.setQueryData<Milestone[]>(
          queryKeys.roadmap.milestones(),
          previousMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  tasks: m.tasks.map((task) =>
                    task.id === taskId ? { ...task, completed: isCompleted } : task
                  ),
                }
              : m
          )
        );
      }

      return { previousMilestone, previousMilestones };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestone(milestoneId),
          context.previousMilestone
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}

export function useDeleteTask(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await ApiClient.delete<ServiceResponse>(
        `/roadmap/milestone/${milestoneId}/task/${taskId}`
      );
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestone = queryClient.getQueryData<Milestone>(
        queryKeys.roadmap.milestone(milestoneId)
      );
      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones()
      );

      if (previousMilestone) {
        queryClient.setQueryData<Milestone>(
          queryKeys.roadmap.milestone(milestoneId),
          {
            ...previousMilestone,
            tasks: previousMilestone.tasks.filter((task) => task.id !== taskId),
          }
        );
      }

      if (previousMilestones) {
        queryClient.setQueryData<Milestone[]>(
          queryKeys.roadmap.milestones(),
          previousMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  tasks: m.tasks.filter((task) => task.id !== taskId),
                }
              : m
          )
        );
      }

      return { previousMilestone, previousMilestones };
    },
    onError: (_error, _taskId, context) => {
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestone(milestoneId),
          context.previousMilestone
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.roadmap.milestones() });
    },
  });
}
