"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { useAuth } from "./useAuthQueries";
import { API_CONFIG } from "@/config/api";
import { useSecureStorage } from "@/hooks/useSecureStorage";

// Types
export type OnboardingData = {
  displayName?: string;
  questionId?: number;
  optionId?: number;
  priorities?: { questionId: number; optionId: number }[];
  isSkip?: boolean; // Flag to indicate user is skipping onboarding
};

export type QuestionOption = {
  id: number;
  optionText: string;
  outcomeId?: number;
};

export type Question = {
  id: number;
  question: string;
  category: string;
  options: QuestionOption[];
};

export type OnboardingQuestionsResponse = {
  success: boolean;
  data: Question[];
  message?: string;
};

export type OnboardingSubmitResponse = {
  success: boolean;
  message: string;
};

// API Functions
const onboardingApi = {
  getQuestions: (): Promise<OnboardingQuestionsResponse> =>
    ApiClient.get("/onboarding", {}, API_CONFIG.API_URL),

  submitOnboarding: (data: OnboardingData): Promise<OnboardingSubmitResponse> =>
    ApiClient.post("/onboarding", data, {}, API_CONFIG.API_URL),
};

// Query Hooks
export function useOnboardingQuestions() {
  const { isAuthenticated, user } = useAuth();

  // Only enable if user is authenticated and has valid onboarding status
  const shouldFetch =
    isAuthenticated &&
    user?.onboardingStatus &&
    ["not_started", "in_progress"].includes(user.onboardingStatus);

  return useQuery({
    queryKey: queryKeys.onboarding.questions(),
    queryFn: onboardingApi.getQuestions,
    enabled: shouldFetch,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
    gcTime: API_CONFIG.AUTH_QUERY.CACHE_TIME,
    retry: (failureCount, error) => {
      // Don't retry auth/forbidden errors or onboarding status errors
      if (error instanceof ApiError) {
        if (error.isUnauthorized || error.isForbidden) {
          return false;
        }
        // Don't retry if onboarding already completed
        if (
          error.status === 400 &&
          error.data?.message?.includes("already completed")
        ) {
          return false;
        }
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
    throwOnError: (error) => {
      // Don't throw for expected onboarding status errors
      if (error instanceof ApiError && error.status === 400) {
        return false;
      }

      return true;
    },
  });
}

export function useOnboardingSubmit() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { removeSecureItem } = useSecureStorage();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (data: OnboardingData) => {
      // Client-side validation
      if (user?.onboardingStatus === "completed") {
        throw new ApiError("Onboarding already completed", 400, {
          message: "Onboarding already completed",
        });
      }

      if (
        user?.onboardingStatus &&
        !["not_started", "in_progress"].includes(user.onboardingStatus)
      ) {
        throw new ApiError("Invalid onboarding status", 400, {
          message: "Invalid onboarding status",
        });
      }

      // Validate required data
      if (!data.displayName && !data.priorities?.length && !data.optionId) {
        throw new ApiError("At least one field must be provided", 400, {
          message:
            "Please provide at least display name, life stage, or priorities",
        });
      }

      return onboardingApi.submitOnboarding(data);
    },
    onSuccess: async (data) => {
      if (data.success) {
        // Clear onboarding secure storage items
        removeSecureItem("onboarding-currentStep");
        removeSecureItem("onboarding-displayName");
        removeSecureItem("onboarding-lifeStage");
        removeSecureItem("onboarding-priorities");

        // Invalidate related queries
        await queryClient.invalidateQueries({
          queryKey: queryKeys.auth.me(),
          refetchType: "active",
        });

        await queryClient.invalidateQueries({
          queryKey: queryKeys.onboarding.all,
        });

        // await refetch to get updated onboarding status
        await queryClient.refetchQueries({
          queryKey: queryKeys.auth.me(),
        });

        // Redirect based on completion status
        if (data.message?.includes("Personalized Roadmap")) {
          // Slight delay to ensure state updates
          setTimeout(() => {
            router.replace("/dashboard");
          }, 100);
        }
      }
    },
    onError: (error) => {
      console.error("Onboarding submission failed:", error);

      if (error instanceof ApiError) {
        if (error.isUnauthorized) {
          router.replace("/auth/login");
        } else if (
          error.status === 400 &&
          error.data?.message?.includes("already completed")
        ) {
          // If onboarding completed by another session, redirect to dashboard
          router.replace("/dashboard");
        }
      }
    },
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.isUnauthorized || error.status === 400)
      ) {
        return false;
      }

      return failureCount < 2; // Only retry twice for network errors
    },
  });
}

// helper hook to get specific question by category
export function useQuestionByCategory(category: string) {
  const { data: questionsResponse, ...rest } = useOnboardingQuestions();

  const question = questionsResponse?.success
    ? questionsResponse.data.find((q) => q.category === category)
    : null;

  return {
    question,
    ...rest,
  };
}

// hooks to get question categories
export function useLifeStageQuestion() {
  return useQuestionByCategory("life_stage");
}

export function usePrioritiesQuestion() {
  return useQuestionByCategory("priorities");
}
