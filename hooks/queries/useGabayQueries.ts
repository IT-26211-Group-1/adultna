"use client";

import { useMutation, useInfiniteQuery, useQuery } from "@tanstack/react-query";
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

interface UseRenameConversationOptions {
  onSuccess?: (sessionId: string, newTopic: string) => void;
  onError?: (error: Error) => void;
}

interface RenameConversationVariables {
  sessionId: string;
  newTopic: string;
}

/**
 * Hook for renaming a Gabay conversation
 */
export function useRenameConversation(options?: UseRenameConversationOptions) {
  const renameMutation = useMutation({
    mutationKey: queryKeys.gabay.rename(),
    mutationFn: async ({
      sessionId,
      newTopic,
    }: RenameConversationVariables) => {
      return gabayApi.renameConversation(sessionId, newTopic);
    },
    onSuccess: (_data, variables) => {
      if (options?.onSuccess) {
        options.onSuccess(variables.sessionId, variables.newTopic);
      }
    },
    onError: (error: Error) => {
      logger.error("[GABAY] Rename conversation error:", error);
      if (options?.onError) {
        options.onError(error);
      }
    },
  });

  return {
    renameConversation: renameMutation.mutate,
    renameConversationAsync: renameMutation.mutateAsync,
    isPending: renameMutation.isPending,
    isError: renameMutation.isError,
    isSuccess: renameMutation.isSuccess,
    error: renameMutation.error,
    reset: renameMutation.reset,
  };
}

/**
 * Hook for fetching conversations with infinite scroll (ChatGPT-style)
 * Loads 5 conversations at a time
 */
export function useGabayConversations() {
  return useInfiniteQuery({
    queryKey: queryKeys.gabay.conversations(),
    queryFn: async ({ pageParam = 0 }) => {
      const response = await gabayApi.getConversations(5, pageParam);

      return response;
    },
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.hasMore) return undefined;

      return allPages.length * 5;
    },
    initialPageParam: 0,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

/**
 * Hook for fetching messages for a specific conversation
 * Cached for 10 minutes to reduce API calls
 */
export function useGabayConversationMessages(sessionId: string | undefined) {
  return useQuery({
    queryKey: ["gabay", "messages", sessionId],
    queryFn: async () => {
      if (!sessionId) return null;
      const response = await gabayApi.getConversationMessages(sessionId);

      return response.messages || [];
    },
    enabled: !!sessionId,
    staleTime: 1000 * 60 * 10, // 10 minutes
    gcTime: 1000 * 60 * 15, // 15 minutes (formerly cacheTime)
  });
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
