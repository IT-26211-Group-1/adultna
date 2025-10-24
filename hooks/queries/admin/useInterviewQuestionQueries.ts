"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import type {
  ListQuestionsParams,
  ListQuestionsResponse,
  CreateQuestionRequest,
  CreateQuestionResponse,
  UpdateQuestionRequest,
  UpdateQuestionResponse,
  UpdateQuestionStatusRequest,
  UpdateQuestionStatusResponse,
  DeleteQuestionResponse,
  RestoreQuestionResponse,
  GenerateAIQuestionRequest,
  GenerateAIQuestionResponse,
} from "@/types/interview-question";

// API Functions
const questionApi = {
  list: (params?: ListQuestionsParams): Promise<ListQuestionsResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.source) queryParams.append("source", params.source);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.limit) queryParams.append("limit", params.limit.toString());
    if (params?.offset) queryParams.append("offset", params.offset.toString());

    const query = queryParams.toString();

    return ApiClient.get(`/interview-questions${query ? `?${query}` : ""}`);
  },

  create: (data: CreateQuestionRequest): Promise<CreateQuestionResponse> =>
    ApiClient.post("/interview-questions", data),

  update: (data: UpdateQuestionRequest): Promise<UpdateQuestionResponse> =>
    ApiClient.put(`/interview-questions/${data.questionId}`, {
      question: data.question,
      category: data.category,
      source: data.source,
    }),

  updateStatus: (
    data: UpdateQuestionStatusRequest,
  ): Promise<UpdateQuestionStatusResponse> =>
    ApiClient.patch(`/interview-questions/${data.questionId}/status`, {
      status: data.status,
    }),

  softDelete: (questionId: string): Promise<DeleteQuestionResponse> =>
    ApiClient.delete(`/interview-questions/${questionId}`),

  restore: (questionId: string): Promise<RestoreQuestionResponse> =>
    ApiClient.post(`/interview-questions/${questionId}/restore`, {}),

  permanentDelete: (questionId: string): Promise<DeleteQuestionResponse> =>
    ApiClient.delete(`/interview-questions/${questionId}/permanent`),

  generateAI: (
    data: GenerateAIQuestionRequest,
  ): Promise<GenerateAIQuestionResponse> =>
    ApiClient.post("/interview-questions/generate-ai", data),
};

// Query Hooks
export function useInterviewQuestions(params?: ListQuestionsParams) {
  const queryClient = useQueryClient();

  // List Questions Query
  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: ["admin", "interview-questions", "list", params],
    queryFn: () => questionApi.list(params),
    staleTime: 3 * 60 * 1000, // 3 minutes
    gcTime: 5 * 60 * 1000, // 5 minutes
  });

  // Create Question Mutation
  const createQuestionMutation = useMutation({
    mutationFn: questionApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Update Question Mutation
  const updateQuestionMutation = useMutation({
    mutationFn: questionApi.update,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "interview-questions",
          "detail",
          variables.questionId,
        ],
      });
    },
  });

  // Update Question Status Mutation
  const updateQuestionStatusMutation = useMutation({
    mutationFn: questionApi.updateStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "interview-questions",
          "detail",
          variables.questionId,
        ],
      });
    },
  });

  // Soft Delete Mutation
  const softDeleteQuestionMutation = useMutation({
    mutationFn: questionApi.softDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Restore Mutation
  const restoreQuestionMutation = useMutation({
    mutationFn: questionApi.restore,
    onSuccess: (data, questionId) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions", "detail", questionId],
      });
    },
  });

  // Permanent Delete Mutation
  const permanentDeleteQuestionMutation = useMutation({
    mutationFn: questionApi.permanentDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  // Generate AI Question Mutation
  const generateAIQuestionMutation = useMutation({
    mutationFn: questionApi.generateAI,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "interview-questions"],
      });
    },
  });

  return {
    // Data
    questions: questionsData?.data?.questions || [],
    total: questionsData?.data?.total || 0,
    questionsData,

    // Loading states
    isLoadingQuestions,
    isCreatingQuestion: createQuestionMutation.isPending,
    isUpdatingQuestion: updateQuestionMutation.isPending,
    isUpdatingStatus: updateQuestionStatusMutation.isPending,
    isDeleting: softDeleteQuestionMutation.isPending,
    isPermanentDeleting: permanentDeleteQuestionMutation.isPending,
    isRestoring: restoreQuestionMutation.isPending,
    isGeneratingAI: generateAIQuestionMutation.isPending,

    // Errors
    questionsError,
    createQuestionError: createQuestionMutation.error,
    updateQuestionError: updateQuestionMutation.error,
    updateStatusError: updateQuestionStatusMutation.error,
    deleteQuestionError:
      softDeleteQuestionMutation.error || permanentDeleteQuestionMutation.error,
    restoreQuestionError: restoreQuestionMutation.error,
    generateAIError: generateAIQuestionMutation.error,

    // Actions
    createQuestion: createQuestionMutation.mutate,
    createQuestionAsync: createQuestionMutation.mutateAsync,
    updateQuestion: updateQuestionMutation.mutate,
    updateQuestionAsync: updateQuestionMutation.mutateAsync,
    updateQuestionStatus: updateQuestionStatusMutation.mutate,
    updateQuestionStatusAsync: updateQuestionStatusMutation.mutateAsync,
    softDeleteQuestion: softDeleteQuestionMutation.mutate,
    softDeleteQuestionAsync: softDeleteQuestionMutation.mutateAsync,
    restoreQuestion: restoreQuestionMutation.mutate,
    restoreQuestionAsync: restoreQuestionMutation.mutateAsync,
    permanentDeleteQuestion: permanentDeleteQuestionMutation.mutate,
    permanentDeleteQuestionAsync: permanentDeleteQuestionMutation.mutateAsync,
    generateAIQuestion: generateAIQuestionMutation.mutate,
    generateAIQuestionAsync: generateAIQuestionMutation.mutateAsync,
    refetchQuestions,

    // Mutation data
    createQuestionData: createQuestionMutation.data,
    updateQuestionData: updateQuestionMutation.data,
    updateStatusData: updateQuestionStatusMutation.data,
    generateAIData: generateAIQuestionMutation.data,
  };
}
