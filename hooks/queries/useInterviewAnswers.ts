"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import type {
  SubmitAnswerRequest,
  SubmitAnswerResponse,
  InterviewAnswer,
} from "@/types/interview-answer";

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const answerApi = {
  submitAnswer: (data: SubmitAnswerRequest): Promise<SubmitAnswerResponse> =>
    ApiClient.post("/interview-answer", data),
  getAnswerById: async (
    answerId: string,
    loadContent = false
  ): Promise<InterviewAnswer> => {
    const response = await ApiClient.get<ApiResponse<InterviewAnswer>>(
      `/interview-answer/${answerId}?loadContent=${loadContent}`
    );

    return response.data;
  },
  getAnswersByIds: (answerIds: string[]): Promise<InterviewAnswer[]> =>
    ApiClient.post("/interview-answer/batch", { answerIds }),
};

export function useSubmitAnswerToQueue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitAnswerRequest) => {
      // Submit answer - returns after grading completes (synchronous)
      const response = await answerApi.submitAnswer(data);

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interview-answers"] });
    },
    onError: (error) => {
      console.error("[useSubmitAnswerToQueue] Failed:", error);
    },
  });
}

export async function pollMultipleAnswersUntilComplete(
  answerIds: string[],
  onProgress?: (completedCount: number, totalCount: number) => void
): Promise<InterviewAnswer[]> {
  const MAX_ATTEMPTS = 300; // 5 minutes max for all answers (increased for 1s polling)
  const POLL_INTERVAL = 1000; // Poll every 1 second for faster UI updates
  const loggedAnswerIds = new Set<string>(); // Track which answers we've already logged

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Fetch all answers at once
    const answers = await Promise.all(
      answerIds.map((id) => answerApi.getAnswerById(id, false))
    );

    // Count completed and failed answers
    const completedAnswers = answers.filter((a) => a.status === "completed");
    const failedAnswers = answers.filter((a) => a.status === "failed");

    // Log newly completed answers with their grading results
    completedAnswers.forEach((answer) => {
      if (!loggedAnswerIds.has(answer.id) && answer.totalScore !== null) {
        loggedAnswerIds.add(answer.id);
      }
    });

    if (onProgress) {
      onProgress(completedAnswers.length, answerIds.length);
    }

    // All answers completed or failed
    if (completedAnswers.length + failedAnswers.length === answerIds.length) {
      // Fetch with full content using batch endpoint (1 API call instead of N)
      const results = await answerApi.getAnswersByIds(answerIds);

      return results;
    }

    // Still processing, wait and try again
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error("Grading timed out. Please check back later.");
}

export function useGetAnswersByIds(answerIds: string[], enabled = true) {
  return useQuery({
    queryKey: ["interview-answers", answerIds],
    queryFn: async () => {
      const result = await answerApi.getAnswersByIds(answerIds);

      return result;
    },
    enabled: enabled && answerIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
