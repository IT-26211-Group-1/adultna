"use client";

import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { gabayApi } from "@/lib/api/gabay";
import type { ChatRequest, ChatResponse } from "@/types/gabay";
import { logger } from "@/lib/logger";

interface UseChatMutationOptions {
  onSuccess?: (response: ChatResponse, message: string) => void;
  onError?: (error: Error) => void;
}

interface ChatMutationVariables {
  message: string;
  sessionId?: string;
}

/**
 * Hook for sending chat messages to the Gabay AI agent
 * Backend loads conversation history from S3 using sessionId
 */
export function useGabayChat(options?: UseChatMutationOptions) {
  const chatMutation = useMutation({
    mutationKey: queryKeys.gabay.chat(),
    mutationFn: async ({ message, sessionId }: ChatMutationVariables) => {
      const request: ChatRequest = {
        message,
        sessionId,
      };

      return gabayApi.chat(request);
    },
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options.onSuccess(data, variables.message);
      }
    },
    onError: (error: Error) => {
      logger.error("[GABAY] Chat error:", error);
      if (options?.onError) {
        options.onError(error);
      }
    },
    retry: 1,
  });

  return {
    // Mutation functions
    sendMessage: chatMutation.mutate,
    sendMessageAsync: chatMutation.mutateAsync,

    // State
    isPending: chatMutation.isPending,
    isError: chatMutation.isError,
    isSuccess: chatMutation.isSuccess,
    error: chatMutation.error,

    // Data
    data: chatMutation.data,

    // Reset
    reset: chatMutation.reset,
  };
}
