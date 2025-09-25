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
    ApiClient.get("/onboarding/view", {}, API_CONFIG.API_URL),

  submitOnboarding: (data: OnboardingData): Promise<OnboardingSubmitResponse> =>
    ApiClient.post("/onboarding", data, {}, API_CONFIG.API_URL),
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
  const { removeSecureItem } = useSecureStorage();

  return useMutation({
    mutationFn: onboardingApi.submitOnboarding,
    onSuccess: async (data) => {
      if (data.success) {
        // Clear onboarding secure storage items
        removeSecureItem("onboarding-currentStep");
        removeSecureItem("onboarding-displayName");
        removeSecureItem("onboarding-lifeStage");
        removeSecureItem("onboarding-priorities");

        // Invalidate and refetch auth to get updated user data from server
        await queryClient.invalidateQueries({
          queryKey: queryKeys.auth.me(),
          refetchType: "active",
        });

        // Wait for auth to refetch
        await queryClient.refetchQueries({
          queryKey: queryKeys.auth.me(),
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
  return useQuestionByCategory("Life Stage");
}

export function usePrioritiesQuestion() {
  return useQuestionByCategory("Priorities");
}
