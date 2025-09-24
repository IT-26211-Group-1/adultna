"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  ApiClient,
  ApiError,
  queryKeys,
  ONBOARDING_API_BASE_URL,
} from "@/lib/apiClient";
import { useAuth } from "./useAuthQueries";
import { API_CONFIG } from "@/config/api";

// Types
export type OnboardingData = {
  displayName?: string;
  questionId?: number;
  optionId?: number;
  priorities?: { questionId: number; optionId: number }[];
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
    ApiClient.get("/onboarding/view", {}, ONBOARDING_API_BASE_URL),

  submitOnboarding: (data: OnboardingData): Promise<OnboardingSubmitResponse> =>
    ApiClient.post("/onboarding", data, {}, ONBOARDING_API_BASE_URL),
};

// Query Hooks
export function useOnboardingQuestions() {
  const { isAuthenticated } = useAuth();

  return useQuery({
    queryKey: queryKeys.onboarding.questions(),
    queryFn: onboardingApi.getQuestions,
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    gcTime: API_CONFIG.AUTH_QUERY.CACHE_TIME,
    retry: (failureCount, error) => {
      if (
        error instanceof ApiError &&
        (error.isUnauthorized || error.isForbidden)
      ) {
        return false;
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
  });
}

export function useOnboardingSubmit() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: onboardingApi.submitOnboarding,
    onSuccess: (data) => {
      if (data.success) {
        // Invalidate and refetch auth to get updated user data from server
        queryClient.invalidateQueries({
          queryKey: queryKeys.auth.me(),
          refetchType: "active",
        });

        if (data.message?.includes("Personalized Roadmap")) {
          setTimeout(() => {
            router.replace("/dashboard");
          }, 100);
        }
      }
    },
    onError: (error) => {
      console.error("Onboarding submission failed:", error);
    },
  });
}

// Helper hook to get specific question by category
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

// Convenience hooks for specific question types
export function useLifeStageQuestion() {
  return useQuestionByCategory("Life Stage");
}

export function usePrioritiesQuestion() {
  return useQuestionByCategory("Priorities");
}
