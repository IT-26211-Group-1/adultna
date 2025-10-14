"use client";

import { useMutation } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { gabayApi } from "@/lib/api/gabay";
import type {
  ChatRequest,
  ChatResponse,
  ConversationMessage,
} from "@/types/gabay";

interface UseChatMutationOptions {
  onSuccess?: (
    response: ChatResponse,
    message: string,
    conversationHistory: ConversationMessage[],
  ) => void;
  onError?: (error: Error) => void;
}

interface ChatMutationVariables {
  message: string;
  conversationHistory: ConversationMessage[];
}

/**
 * Hook for sending chat messages to the Gabay AI agent
 */
export function useGabayChat(options?: UseChatMutationOptions) {
  const chatMutation = useMutation({
    mutationKey: queryKeys.gabay.chat(),
    mutationFn: async ({
      message,
      conversationHistory,
    }: ChatMutationVariables) => {
      // Transform ConversationMessage to ChatMessage format for API
      const historyForApi = conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      const request: ChatRequest = {
        message,
        conversationHistory: historyForApi,
      };

      return gabayApi.chat(request);
    },
    onSuccess: (data, variables) => {
      if (options?.onSuccess) {
        options.onSuccess(
          data,
          variables.message,
          variables.conversationHistory,
        );
      }
    },
    onError: (error: Error) => {
      console.error("[GABAY] Chat error:", error);
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
