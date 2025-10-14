"use client";

import { useState } from "react";
import { ChatMessage } from "./ChatMessage";
import { AgentWelcome } from "./AgentWelcome";
import { SuggestionButton } from "./SuggestionButton";
import { ChatInput } from "./ChatInput";
import { useGabayChat } from "@/hooks/queries/useGabayQueries";
import type { ConversationMessage } from "@/types/gabay";

const INITIAL_SUGGESTIONS = [
  "Requirements for Postal ID",
  "Where can I get an NBI Clearance",
  "Help me find a job",
];

export function ChatContainer() {
  const [messages, setMessages] = useState<ConversationMessage[]>([]);

  const { sendMessage, isPending } = useGabayChat({
    onSuccess: (response) => {
      if (response.success && response.message) {
        // Add AI response to messages
        const aiMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, aiMessage]);
      } else if (response.blocked) {
        // Handle blocked content
        const errorMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            response.blockReason ||
            "Your message was blocked due to content policy.",
          timestamp: new Date(),
          error: "Content blocked",
        };

        setMessages((prev) => [...prev, errorMessage]);
      } else if (response.error) {
        // Handle API error
        const errorMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            "Sorry, I encountered an error processing your request. Please try again.",
          timestamp: new Date(),
          error: response.error,
        };

        setMessages((prev) => [...prev, errorMessage]);
      }
    },
    onError: (error) => {
      const errorMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "Something went wrong. Please try again.",
        timestamp: new Date(),
        error: error.message,
      };

      setMessages((prev) => [...prev, errorMessage]);
    },
  });

  const handleSendMessage = (text: string) => {
    // Add user message immediately
    const userMessage: ConversationMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    // Send to API with conversation history
    sendMessage({
      message: text,
      conversationHistory: messages,
    });
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };

  return (
    <div className="flex h-full flex-col">
      {/* Chat Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="mx-auto max-w-3xl space-y-6">
          {/* Welcome Message */}
          <AgentWelcome />

          {/* Chat Messages */}
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              isUser={message.role === "user"}
              message={message.content}
            />
          ))}

          {/* Loading Indicator */}
          {isPending && (
            <div className="flex w-full justify-start">
              <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm text-gray-900 dark:bg-gray-800 dark:text-gray-100">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Suggestions and Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto max-w-3xl space-y-4">
          {/* Suggestion Buttons - Only show if no messages yet */}
          {messages.length === 0 && (
            <div className="flex flex-wrap gap-2">
              {INITIAL_SUGGESTIONS.map((suggestion) => (
                <SuggestionButton
                  key={suggestion}
                  text={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                />
              ))}
            </div>
          )}

          {/* Chat Input */}
          <ChatInput disabled={isPending} onSubmit={handleSendMessage} />
        </div>
      </div>
    </div>
  );
}
