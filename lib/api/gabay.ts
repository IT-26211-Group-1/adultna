"use client";

import { ApiClient } from "../apiClient";
import type { ChatRequest, ChatResponse } from "@/types/gabay";

export const gabayApi = {
  /**
   * Send a message to the Gabay AI agent
   */
  chat: async (data: ChatRequest): Promise<ChatResponse> => {
    return ApiClient.post<ChatResponse>("/gabay/chat", data);
  },
};
