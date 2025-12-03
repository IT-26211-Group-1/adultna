"use client";

import { ApiClient } from "../apiClient";
import type {
  ChatRequest,
  ChatResponse,
  GetConversationsResponse,
  GetMessagesResponse,
} from "@/types/gabay";

export const gabayApi = {
  /**
   * Send a message to the Gabay AI agent
   */
  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    return ApiClient.post<ChatResponse>("/gabay/chat", data);
  },

  /**
   * Rename a conversation
   */
  renameConversation: async (
    sessionId: string,
    newTopic: string,
  ): Promise<{ success: boolean; message: string }> => {
    return ApiClient.post("/gabay/rename", { sessionId, newTopic });
  },

  /**
   * Get paginated conversations for the current user
   */
  getConversations: async (
    limit: number = 5,
    offset: number = 0,
  ): Promise<GetConversationsResponse> => {
    return ApiClient.get<GetConversationsResponse>(
      `/gabay/conversations?limit=${limit}&offset=${offset}`,
    );
  },

  /**
   * Get messages for a specific conversation
   */
  getConversationMessages: async (
    sessionId: string,
  ): Promise<GetMessagesResponse> => {
    return ApiClient.get<GetMessagesResponse>(
      `/gabay/messages?sessionId=${sessionId}`,
    );
  },

  /**
   * Delete a conversation
   */
  deleteConversation: async (
    sessionId: string,
  ): Promise<{ success: boolean; message: string }> => {
    return ApiClient.delete(`/gabay/conversations/${sessionId}`);
  },
};
