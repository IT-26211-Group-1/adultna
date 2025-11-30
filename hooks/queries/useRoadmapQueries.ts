"use client";

import { useRef } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import {
  Milestone,
  CreateMilestonePayload,
  UpdateMilestonePayload,
} from "@/types/roadmap";
import { addToast } from "@heroui/toast";

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

export function useUserMilestonesWithPolling(enablePolling = false) {
  const startTimeRef = useRef(Date.now());
  const POLLING_INTERVAL = 2500; // 2.5 seconds
  const MAX_POLLING_DURATION = 30000; // 30 seconds

  return useQuery({
    queryKey: queryKeys.roadmap.milestones(),
    queryFn: async () => {
      const response = await ApiClient.get<
        ServiceResponse<{ milestones: Milestone[]; count: number }>
      >("/roadmap/milestones");

      return response.data?.milestones || [];
    },
    refetchInterval: (query) => {
      if (!enablePolling) return false;

      const milestones = query.state.data || [];
      const hasElapsedMaxTime =
        Date.now() - startTimeRef.current > MAX_POLLING_DURATION;

      // Stop polling if we have milestones or max time has elapsed
      if (milestones.length > 0 || hasElapsedMaxTime) {
        return false;
      }

      // Continue polling
      return POLLING_INTERVAL;
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
      addToast({
        title: "Success",
        description: "Milestone created successfully!",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: "Error",
        description:
          error?.response?.data?.message || "Failed to create milestone",
        color: "danger",
      });
    },
  });
}

export function useUpdateMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      data: UpdateMilestonePayload & { milestoneId: string },
    ) => {
      const { milestoneId, ...payload } = data;

      if (!milestoneId || milestoneId.trim() === "") {
        throw new Error("Milestone ID is required");
      }

      const response = await ApiClient.patch<ServiceResponse>(
        `/roadmap/milestones/${milestoneId}`,
        payload,
      );

      return response;
    },
    onSuccess: (_data, variables) => {
      const { milestoneId } = variables;

      if (milestoneId && milestoneId.trim() !== "") {
        queryClient.invalidateQueries({
          queryKey: queryKeys.roadmap.milestone(milestoneId),
        });
        queryClient.invalidateQueries({
          queryKey: queryKeys.roadmap.milestones(),
        });
      }
    },
  });
}

export function useUpdateMilestoneStatus(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (status: string) => {
      if (!milestoneId || milestoneId.trim() === "") {
        throw new Error("Milestone ID is required");
      }

      const response = await ApiClient.patch<
        ServiceResponse<{ milestoneId: string; status: string }>
      >(`/roadmap/milestones/${milestoneId}/status`, { status });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
    },
  });
}

export function useCreateTask(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (title: string) => {
      if (!milestoneId || milestoneId.trim() === "") {
        throw new Error("Milestone ID is required");
      }

      const response = await ApiClient.post<
        ServiceResponse<{
          task: { id: string; title: string; completed: boolean };
        }>
      >(`/roadmap/milestone/${milestoneId}/task`, { title });

      return response.data?.task;
    },
    onMutate: async (title) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestone = queryClient.getQueryData<Milestone>(
        queryKeys.roadmap.milestone(milestoneId),
      );
      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones(),
      );

      const tempId = `temp-${Date.now()}`;
      const newTask = { id: tempId, title, completed: false };

      if (previousMilestone) {
        queryClient.setQueryData<Milestone>(
          queryKeys.roadmap.milestone(milestoneId),
          {
            ...previousMilestone,
            tasks: [...previousMilestone.tasks, newTask],
          },
        );
      }

      if (previousMilestones) {
        queryClient.setQueryData<Milestone[]>(
          queryKeys.roadmap.milestones(),
          previousMilestones.map((m) =>
            m.id === milestoneId
              ? {
                  ...m,
                  tasks: [...m.tasks, newTask],
                }
              : m,
          ),
        );
      }

      return { previousMilestone, previousMilestones };
    },
    onError: (_error, _title, context) => {
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestone(milestoneId),
          context.previousMilestone,
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
    },
  });
}

export function useUpdateTask(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      isCompleted,
      title,
    }: {
      taskId: string;
      isCompleted?: boolean;
      title?: string;
    }) => {
      if (!milestoneId || milestoneId.trim() === "") {
        throw new Error("Milestone ID is required");
      }

      const body: any = {};

      if (isCompleted !== undefined) body.isCompleted = isCompleted;
      if (title !== undefined) body.title = title;

      const response = await ApiClient.patch<ServiceResponse>(
        `/roadmap/milestone/${milestoneId}/task/${taskId}`,
        body,
      );

      return response;
    },
    onMutate: async ({ taskId, isCompleted, title }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestone = queryClient.getQueryData<Milestone>(
        queryKeys.roadmap.milestone(milestoneId),
      );
      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones(),
      );

      if (previousMilestone) {
        queryClient.setQueryData<Milestone>(
          queryKeys.roadmap.milestone(milestoneId),
          {
            ...previousMilestone,
            tasks: previousMilestone.tasks.map((task) =>
              task.id === taskId
                ? {
                    ...task,
                    ...(isCompleted !== undefined && {
                      completed: isCompleted,
                    }),
                    ...(title !== undefined && { title }),
                  }
                : task,
            ),
          },
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
                    task.id === taskId
                      ? {
                          ...task,
                          ...(isCompleted !== undefined && {
                            completed: isCompleted,
                          }),
                          ...(title !== undefined && { title }),
                        }
                      : task,
                  ),
                }
              : m,
          ),
        );
      }

      return { previousMilestone, previousMilestones };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestone(milestoneId),
          context.previousMilestone,
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
    },
  });
}

export function useDeleteTask(milestoneId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      if (!milestoneId || milestoneId.trim() === "") {
        throw new Error("Milestone ID is required");
      }

      const response = await ApiClient.delete<ServiceResponse>(
        `/roadmap/milestone/${milestoneId}/task/${taskId}`,
      );

      return response;
    },
    onMutate: async (taskId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestone = queryClient.getQueryData<Milestone>(
        queryKeys.roadmap.milestone(milestoneId),
      );
      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones(),
      );

      if (previousMilestone) {
        queryClient.setQueryData<Milestone>(
          queryKeys.roadmap.milestone(milestoneId),
          {
            ...previousMilestone,
            tasks: previousMilestone.tasks.filter((task) => task.id !== taskId),
          },
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
              : m,
          ),
        );
      }

      return { previousMilestone, previousMilestones };
    },
    onError: (_error, _taskId, context) => {
      if (context?.previousMilestone) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestone(milestoneId),
          context.previousMilestone,
        );
      }
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestone(milestoneId),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
    },
  });
}

export function useDeleteMilestone() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (milestoneId: string) => {
      const response = await ApiClient.delete<ServiceResponse>(
        `/roadmap/milestones/${milestoneId}`,
      );

      return response;
    },
    onMutate: async (milestoneId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });

      const previousMilestones = queryClient.getQueryData<Milestone[]>(
        queryKeys.roadmap.milestones(),
      );

      if (previousMilestones) {
        queryClient.setQueryData<Milestone[]>(
          queryKeys.roadmap.milestones(),
          previousMilestones.filter((m) => m.id !== milestoneId),
        );
      }

      return { previousMilestones };
    },
    onError: (_error, _milestoneId, context) => {
      if (context?.previousMilestones) {
        queryClient.setQueryData(
          queryKeys.roadmap.milestones(),
          context.previousMilestones,
        );
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.roadmap.milestones(),
      });
    },
  });
}
