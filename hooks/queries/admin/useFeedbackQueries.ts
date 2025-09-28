"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";

// Types
export type FeedbackStatus = "pending" | "resolved";

export type FeedbackType = "report" | "feedback";

export type Feedback = {
  id: string;
  type: FeedbackType;
  feature: string;
  title: string;
  description: string;
  status: FeedbackStatus;
  submittedBy: string;
  submittedByEmail?: string;
  submittedByName?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateFeedbackRequest = {
  type: FeedbackType;
  feature: string;
  title: string;
  description: string;
};

export type CreateFeedbackResponse = {
  success: boolean;
  message: string;
  feedbackId?: string;
};

export type UpdateFeedbackStatusRequest = {
  feedbackId: string;
  status: FeedbackStatus;
};

export type UpdateFeedbackStatusResponse = {
  success: boolean;
  message: string;
};

export type FeedbackListResponse = {
  success: boolean;
  feedback: Feedback[];
  count: number;
};

export type FeedbackDetailResponse = {
  success: boolean;
  feedback: Feedback;
};

// API Functions
const feedbackApi = {
  // List all feedback (admin only)
  listFeedback: (): Promise<FeedbackListResponse> =>
    ApiClient.get("/feedback/view"),

  // Get feedback by ID (admin only)
  getFeedbackById: (feedbackId: string): Promise<FeedbackDetailResponse> =>
    ApiClient.get(`/feedback/view/${feedbackId}`),

  // Create feedback
  createFeedback: (data: CreateFeedbackRequest): Promise<CreateFeedbackResponse> =>
    ApiClient.post("/feedback/create", data),

  // Update feedback status (admin only)
  updateFeedbackStatus: (
    data: UpdateFeedbackStatusRequest
  ): Promise<UpdateFeedbackStatusResponse> =>
    ApiClient.put(`/feedback/update/${data.feedbackId}`, {
      status: data.status,
    }),
};

// Feedback Management Hook
export function useFeedback() {
  const queryClient = useQueryClient();

  // List Feedback Query
  const {
    data: feedbackData,
    isLoading: isLoadingFeedback,
    error: feedbackError,
    refetch: refetchFeedback,
  } = useQuery({
    queryKey: queryKeys.admin.feedback?.list() || ["admin", "feedback", "list"],
    queryFn: feedbackApi.listFeedback,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create Feedback Mutation
  const createFeedbackMutation = useMutation({
    mutationFn: feedbackApi.createFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.feedback?.all || ["admin", "feedback"],
      });
    },
  });

  // Update Feedback Status Mutation
  const updateFeedbackStatusMutation = useMutation({
    mutationFn: feedbackApi.updateFeedbackStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.feedback?.all || ["admin", "feedback"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.feedback?.detail?.(variables.feedbackId) || [
          "admin",
          "feedback",
          "detail",
          variables.feedbackId,
        ],
      });
    },
  });

  // Ensure feedback data is properly structured
  const safeProcess = (data: FeedbackListResponse | undefined): Feedback[] => {
    console.log("Raw feedback data received:", data);
  console.log("Full API response structure:", JSON.stringify(data, null, 2));

    if (!data?.feedback || !Array.isArray(data.feedback)) {
      console.log("No feedback array found in response");
      return [];
    }

    console.log("Processing feedback items:", data.feedback.length);

    const processedFeedback = data.feedback.map((item: any, index) => {
      console.log(`Processing item ${index}:`, item);
      console.log(`Raw feature value:`, item.feature);
      console.log(`Raw submittedByName:`, item.submittedByName);
      console.log(`Raw submittedByEmail:`, item.submittedByEmail);
      console.log(`Raw status:`, item.status);

      // Map the data structure to match our expected format
      // Handle both old structure (with IDs) and new structure (with resolved names)
      let featureName = item.feature;
      let statusName = item.status;
      let userName = item.submittedByName;
      let userEmail = item.submittedByEmail;

      // Sanitize feature name: capitalize first letter of every word
      if (featureName && featureName !== 'Unknown Feature') {
        featureName = featureName
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
          .join(' ');
      }

      // If we have raw IDs but no resolved names, create descriptive labels
      if (!featureName && item.featureId) {
        const featureMap: Record<string, string> = {
          '1': 'GovMap',
          '2': 'FileBox',
          '3': 'Process Guides',
          '4': 'AI Gabay Agent',
          '5': 'Mock Interview Coach'
        };
        featureName = featureMap[item.featureId] || `Feature ${item.featureId}`;
      }

      if (!statusName && item.statusId) {
        const statusMap: Record<string, string> = {
          '1': 'pending',
          '2': 'resolved'
        };
        statusName = statusMap[item.statusId] || `Status ${item.statusId}`;
      }

      if (!userName && item.userId) {
        userName = `User ${item.userId.substring(0, 8)}...`;
      }

      // Use submittedByEmail from JOIN with users table
      if (!userEmail) {
        userEmail = item.submittedByEmail || 'Email not available';
      }

      const mappedItem: Feedback = {
        id: item.id || '',
        type: item.type as FeedbackType || 'feedback',
        feature: featureName || 'Unknown Feature',
        title: item.title || 'No Title',
        description: item.description || 'No Description',
        status: statusName as FeedbackStatus || 'pending',
        submittedBy: item.submittedBy || item.userId || '',
        submittedByEmail: userEmail || 'No Email',
        submittedByName: userName || 'Unknown User',
        createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
        updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
      };

      console.log(`Mapped item ${index}:`, mappedItem);
      return mappedItem;
    });

    const validItems = processedFeedback.filter(item =>
      item &&
      typeof item.id === 'string' &&
      typeof item.title === 'string' &&
      typeof item.status === 'string' &&
      typeof item.type === 'string'
    );

    console.log("Valid items after filtering:", validItems);
    return validItems;
  };

  const safeFeedback = safeProcess(feedbackData);

  return {
    // Data
    feedback: safeFeedback,
    feedbackCount: feedbackData?.count || safeFeedback.length,
    feedbackData,

    // Loading states
    isLoadingFeedback,
    isCreatingFeedback: createFeedbackMutation.isPending,
    isUpdatingStatus: updateFeedbackStatusMutation.isPending,

    // Errors
    feedbackError,
    createFeedbackError: createFeedbackMutation.error,
    updateStatusError: updateFeedbackStatusMutation.error,

    // Actions
    createFeedback: createFeedbackMutation.mutate,
    createFeedbackAsync: createFeedbackMutation.mutateAsync,
    updateFeedbackStatus: updateFeedbackStatusMutation.mutate,
    updateFeedbackStatusAsync: updateFeedbackStatusMutation.mutateAsync,
    refetchFeedback,

    // Mutation data
    createFeedbackData: createFeedbackMutation.data,
    updateStatusData: updateFeedbackStatusMutation.data,
  };
}

// Individual Feedback Hook
export function useFeedbackDetail(feedbackId: string) {
  const {
    data: feedbackData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.feedback?.detail?.(feedbackId) || [
      "admin",
      "feedback",
      "detail",
      feedbackId,
    ],
    queryFn: () => feedbackApi.getFeedbackById(feedbackId),
    enabled: !!feedbackId,
    staleTime: 2 * 60 * 1000, // 2 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    feedback: feedbackData?.feedback,
    feedbackData,
    isLoading,
    error,
    refetch,
  };
}