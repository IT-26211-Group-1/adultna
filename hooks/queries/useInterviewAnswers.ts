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
    loadContent = false,
  ): Promise<InterviewAnswer> => {
    const response = await ApiClient.get<ApiResponse<InterviewAnswer>>(
      `/interview-answer/${answerId}?loadContent=${loadContent}`,
    );

    return response.data;
  },
  getAnswersByIds: (answerIds: string[]): Promise<InterviewAnswer[]> =>
    ApiClient.post("/interview-answer/batch", { answerIds }),
};

async function pollAnswerUntilComplete(
  answerId: string,
): Promise<InterviewAnswer> {
  const MAX_ATTEMPTS = 90; // 90 seconds max (grading can take time with retries)
  const POLL_INTERVAL = 1000; // Poll every 1 second

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    console.log(
      `[pollAnswerUntilComplete] Polling attempt ${attempt + 1}/${MAX_ATTEMPTS}`,
    );

    const answer = await answerApi.getAnswerById(answerId, false);

    if (answer.status === "completed") {
      console.log("[pollAnswerUntilComplete] Answer grading completed!");

      // Fetch with full content now that it's completed
      return answerApi.getAnswerById(answerId, true);
    }

    if (answer.status === "failed") {
      console.error("[pollAnswerUntilComplete] Answer grading failed");
      throw new Error("Answer grading failed. Please try again.");
    }

    // Still pending or processing, wait and try again
    console.log(
      `[pollAnswerUntilComplete] Status: ${answer.status}, waiting...`,
    );
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
  }

  throw new Error("Answer grading timed out. Please check back later.");
}

export function useSubmitAnswer() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitAnswerRequest) => {
      console.log("[useSubmitAnswer] Submitting answer...");

      // Submit answer - returns immediately with pending status
      const response = await answerApi.submitAnswer(data);

      console.log(
        "[useSubmitAnswer] Answer submitted, starting polling for answer ID:",
        response.id,
      );

      // Poll until grading is complete
      const completedAnswer = await pollAnswerUntilComplete(response.id);

      console.log("[useSubmitAnswer] Grading completed:", completedAnswer);

      return completedAnswer;
    },
    onSuccess: (data) => {
      console.log("[useSubmitAnswer] Success! Invalidating queries");
      queryClient.invalidateQueries({ queryKey: ["interview-answers"] });
    },
    onError: (error) => {
      console.error("[useSubmitAnswer] Failed:", error);
    },
  });
}

export function useGetAnswerById(answerId: string | null, loadContent = false) {
  return useQuery({
    queryKey: ["interview-answer", answerId, loadContent],
    queryFn: async () => {
      if (!answerId) throw new Error("Answer ID is required");
      console.log("[useGetAnswerById] Fetching answer:", answerId);
      const result = await answerApi.getAnswerById(answerId, loadContent);

      console.log("[useGetAnswerById] Received answer:", result);

      return result;
    },
    enabled: !!answerId,
    staleTime: 30 * 1000, // Refresh every 30 seconds
    retry: 2,
  });
}

export function useGetAnswersByIds(answerIds: string[], enabled = true) {
  return useQuery({
    queryKey: ["interview-answers", answerIds],
    queryFn: async () => {
      console.log("[useGetAnswersByIds] Fetching answers:", answerIds);
      const result = await answerApi.getAnswersByIds(answerIds);

      console.log("[useGetAnswersByIds] Received answers:", result);

      return result;
    },
    enabled: enabled && answerIds.length > 0,
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
