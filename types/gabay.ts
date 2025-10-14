export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory?: ChatMessage[];
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  blocked?: boolean;
  blockReason?: string;
  error?: string;
  metadata?: {
    model: string;
    tokensUsed?: number;
    processingTime?: number;
  };
}

export interface ConversationMessage extends ChatMessage {
  id: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
}
