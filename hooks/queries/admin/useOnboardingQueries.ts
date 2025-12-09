"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";

// Types
export type QuestionStatus = "pending" | "accepted" | "rejected" | "to_revise";

export type QuestionCategory =
  | "personal"
  | "career"
  | "education"
  | "preferences";

export type AnswerOption = {
  id: number;
  questionId: number;
  optionText: string;
  outcomeId: number | null;
  outcomeTagName?: string;
  createdAt: string;
  updatedAt: string | null;
};

export type OnboardingQuestion = {
  id: number;
  question: string;
  category: QuestionCategory;
  status: QuestionStatus;
  createdAt: string;
  updatedAt: string | null;
  createdBy?: string | null;
  createdByEmail?: string | null;
  updatedBy?: string | null;
  updatedByEmail?: string | null;
  deletedBy?: string | null;
  deletedByEmail?: string | null;
  deletedAt?: string | null;
  reason?: string | null;
  options?: AnswerOption[];
};

export type CreateQuestionRequest = {
  question: string;
  category: string;
  options: {
    optionText: string;
    outcomeTagName?: string;
  }[];
};

export type CreateQuestionResponse = {
  success: boolean;
  message: string;
  questionId?: number;
};

export type UpdateQuestionRequest = {
  questionId: number;
  question?: string;
  category?: string;
};

export type UpdateQuestionResponse = {
  success: boolean;
  message: string;
};

export type UpdateQuestionStatusRequest = {
  questionId: number;
  status: QuestionStatus;
  reason?: string;
};

export type UpdateQuestionStatusResponse = {
  success: boolean;
  message: string;
};

export type DeleteQuestionRequest = {
  questionId: number;
};

export type DeleteQuestionResponse = {
  success: boolean;
  message: string;
};

export type RestoreQuestionRequest = {
  questionId: number;
};

export type RestoreQuestionResponse = {
  success: boolean;
  message: string;
};

export type PermanentDeleteQuestionRequest = {
  questionId: number;
};

export type PermanentDeleteQuestionResponse = {
  success: boolean;
  message: string;
};

export type BatchOperationResponse = {
  success: boolean;
  message: string;
  results: {
    successful: number[];
    failed: Array<{ questionId: number; reason: string }>;
  };
};

export type QuestionsListResponse = {
  success: boolean;
  data: OnboardingQuestion[];
  count: number;
};

export type QuestionDetailResponse = {
  success: boolean;
  data: OnboardingQuestion;
};

// API Functions
const onboardingApi = {
  listQuestions: (): Promise<QuestionsListResponse> =>
    ApiClient.get("/admin/onboarding/questions"),

  getQuestionById: (questionId: number): Promise<QuestionDetailResponse> =>
    ApiClient.get(`/admin/onboarding/questions/${questionId}`),

  createQuestion: (
    data: CreateQuestionRequest,
  ): Promise<CreateQuestionResponse> =>
    ApiClient.post("/onboarding/create", data),

  updateQuestion: (
    data: UpdateQuestionRequest,
  ): Promise<UpdateQuestionResponse> =>
    ApiClient.put(`/admin/onboarding/questions/${data.questionId}`, {
      questionId: data.questionId,
      question: data.question,
      category: data.category,
    }),

  updateQuestionStatus: (
    data: UpdateQuestionStatusRequest,
  ): Promise<UpdateQuestionStatusResponse> =>
    ApiClient.patch("/admin/onboarding/questions/status", data),

  deleteQuestion: (
    data: DeleteQuestionRequest,
  ): Promise<DeleteQuestionResponse> =>
    ApiClient.delete(`/admin/onboarding/questions/${data.questionId}`),

  restoreQuestion: (
    data: RestoreQuestionRequest,
  ): Promise<RestoreQuestionResponse> =>
    ApiClient.patch(
      `/admin/onboarding/questions/${data.questionId}/restore`,
      {},
    ),

  permanentDeleteQuestion: (
    data: PermanentDeleteQuestionRequest,
  ): Promise<PermanentDeleteQuestionResponse> =>
    ApiClient.delete(`/admin/onboarding/questions/${data.questionId}/delete`),

  batchArchiveQuestions: (
    questionIds: number[],
  ): Promise<BatchOperationResponse> =>
    ApiClient.post("/admin/onboarding/questions/batch/archive", {
      questionIds,
    }),

  batchRestoreQuestions: (
    questionIds: number[],
  ): Promise<BatchOperationResponse> =>
    ApiClient.post("/admin/onboarding/questions/batch/restore", {
      questionIds,
    }),

  batchPermanentDeleteQuestions: (
    questionIds: number[],
  ): Promise<BatchOperationResponse> =>
    ApiClient.post("/admin/onboarding/questions/batch/delete", { questionIds }),
};

// Onboarding Questions Management Hook
export function useOnboardingQuestions() {
  const queryClient = useQueryClient();

  const {
    data: questionsData,
    isLoading: isLoadingQuestions,
    error: questionsError,
    refetch: refetchQuestions,
  } = useQuery({
    queryKey: queryKeys.admin.onboarding?.list() || [
      "admin",
      "onboarding",
      "list",
    ],
    queryFn: onboardingApi.listQuestions,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  const createQuestionMutation = useMutation({
    mutationFn: onboardingApi.createQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  const updateQuestionMutation = useMutation({
    mutationFn: onboardingApi.updateQuestion,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.detail?.(
          variables.questionId,
        ) || ["admin", "onboarding", "detail", variables.questionId],
      });
    },
  });

  const updateQuestionStatusMutation = useMutation({
    mutationFn: onboardingApi.updateQuestionStatus,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.detail?.(
          variables.questionId,
        ) || ["admin", "onboarding", "detail", variables.questionId],
      });
    },
  });

  const deleteQuestionMutation = useMutation({
    mutationFn: onboardingApi.deleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  const restoreQuestionMutation = useMutation({
    mutationFn: onboardingApi.restoreQuestion,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.detail?.(
          variables.questionId,
        ) || ["admin", "onboarding", "detail", variables.questionId],
      });
    },
  });

  const permanentDeleteQuestionMutation = useMutation({
    mutationFn: onboardingApi.permanentDeleteQuestion,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  const batchArchiveQuestionsMutation = useMutation({
    mutationFn: onboardingApi.batchArchiveQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  const batchRestoreQuestionsMutation = useMutation({
    mutationFn: onboardingApi.batchRestoreQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  const batchPermanentDeleteQuestionsMutation = useMutation({
    mutationFn: onboardingApi.batchPermanentDeleteQuestions,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.admin.onboarding?.all || ["admin", "onboarding"],
      });
    },
  });

  return {
    questions: questionsData?.data || [],
    questionsCount: questionsData?.count || 0,
    questionsData,

    isLoadingQuestions,
    isCreating: createQuestionMutation.isPending,
    isUpdating: updateQuestionMutation.isPending,
    isUpdatingStatus: updateQuestionStatusMutation.isPending,
    isDeleting: deleteQuestionMutation.isPending,
    isRestoring: restoreQuestionMutation.isPending,
    isPermanentDeleting: permanentDeleteQuestionMutation.isPending,

    questionsError,
    createQuestionError: createQuestionMutation.error,
    updateQuestionError: updateQuestionMutation.error,
    updateStatusError: updateQuestionStatusMutation.error,
    deleteQuestionError: deleteQuestionMutation.error,
    restoreQuestionError: restoreQuestionMutation.error,
    permanentDeleteQuestionError: permanentDeleteQuestionMutation.error,

    createQuestion: createQuestionMutation.mutate,
    createQuestionAsync: createQuestionMutation.mutateAsync,
    updateQuestion: updateQuestionMutation.mutate,
    updateQuestionAsync: updateQuestionMutation.mutateAsync,
    updateQuestionStatus: updateQuestionStatusMutation.mutate,
    updateQuestionStatusAsync: updateQuestionStatusMutation.mutateAsync,
    deleteQuestion: deleteQuestionMutation.mutate,
    deleteQuestionAsync: deleteQuestionMutation.mutateAsync,
    restoreQuestion: restoreQuestionMutation.mutate,
    restoreQuestionAsync: restoreQuestionMutation.mutateAsync,
    permanentDeleteQuestion: permanentDeleteQuestionMutation.mutate,
    permanentDeleteQuestionAsync: permanentDeleteQuestionMutation.mutateAsync,
    batchArchiveQuestions: batchArchiveQuestionsMutation.mutate,
    batchArchiveQuestionsAsync: batchArchiveQuestionsMutation.mutateAsync,
    isBatchArchiving: batchArchiveQuestionsMutation.isPending,
    batchRestoreQuestions: batchRestoreQuestionsMutation.mutate,
    batchRestoreQuestionsAsync: batchRestoreQuestionsMutation.mutateAsync,
    isBatchRestoring: batchRestoreQuestionsMutation.isPending,
    batchPermanentDeleteQuestions: batchPermanentDeleteQuestionsMutation.mutate,
    batchPermanentDeleteQuestionsAsync:
      batchPermanentDeleteQuestionsMutation.mutateAsync,
    isBatchPermanentDeleting: batchPermanentDeleteQuestionsMutation.isPending,
    refetchQuestions,

    createQuestionData: createQuestionMutation.data,
    updateQuestionData: updateQuestionMutation.data,
    updateStatusData: updateQuestionStatusMutation.data,
    deleteQuestionData: deleteQuestionMutation.data,
    restoreQuestionData: restoreQuestionMutation.data,
    permanentDeleteQuestionData: permanentDeleteQuestionMutation.data,
  };
}

export function useOnboardingQuestionDetail(questionId: number) {
  const {
    data: questionData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.admin.onboarding?.detail?.(questionId) || [
      "admin",
      "onboarding",
      "detail",
      questionId,
    ],
    queryFn: () => onboardingApi.getQuestionById(questionId),
    enabled: !!questionId,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });

  return {
    question: questionData?.data,
    questionData,
    isLoading,
    error,
    refetch,
  };
}
