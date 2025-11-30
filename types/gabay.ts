export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string; // Optional: backend creates new session if not provided
}

export interface ChatResponse {
  success: boolean;
  message?: string;
  sessionId?: string; // Backend returns session ID for tracking
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

// Conversation history type for sidebar
export interface Conversation {
  id: string;
  title: string;
  lastMessage?: string;
  lastActivityAt: Date;
  messageCount: number;
}

export interface GetConversationsResponse {
  success: boolean;
  conversations: Array<{
    sessionId: string;
    topic: string;
    messageCount: number;
    startedAt: string;
    lastMessage?: string;
  }>;
  hasMore: boolean;
  total: number;
}
