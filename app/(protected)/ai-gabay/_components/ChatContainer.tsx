"use client";

import { useState, useCallback, useRef } from "react";
import { MenuIcon, ArrowDownIcon } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { AgentWelcome } from "./AgentWelcome";
import { SuggestionButton } from "./SuggestionButton";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import { useGabayChat } from "@/hooks/queries/useGabayQueries";
import type { ConversationMessage, Conversation } from "@/types/gabay";

const INITIAL_SUGGESTIONS = [
  "Requirements for Postal ID",
  "Where can I get an NBI Clearance",
  "Help me find a job",
  "How do I apply for SSS?",
];

const STORAGE_KEY = "gabay_conversations";

interface StoredConversation {
  id: string;
  title: string;
  messages: ConversationMessage[];
  lastActivityAt: string;
}

// Helper to sync localStorage
const saveToStorage = (conversations: StoredConversation[]) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
  } catch (e) {
    console.error("Failed to save conversations", e);
  }
};

const loadFromStorage = (): StoredConversation[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Failed to load conversations", e);

    return [];
  }
};

export function ChatContainerOptimized() {
  // Initialize from localStorage synchronously
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [conversations, setConversations] = useState<StoredConversation[]>(() =>
    loadFromStorage(),
  );
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    () => {
      const stored = loadFromStorage();

      if (stored.length > 0) {
        const mostRecent = stored.sort(
          (a, b) =>
            new Date(b.lastActivityAt).getTime() -
            new Date(a.lastActivityAt).getTime(),
        )[0];

        return mostRecent.id;
      }

      return undefined;
    },
  );
  const [messages, setMessages] = useState<ConversationMessage[]>(() => {
    const stored = loadFromStorage();
    const current = stored.find((c) => c.id === currentSessionId);

    return (
      current?.messages.map((m) => ({
        ...m,
        timestamp: new Date(m.timestamp),
      })) || []
    );
  });

  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Ref callback for auto-scroll
  const messagesEndCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Scroll handler
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const isNearBottom =
      target.scrollHeight - target.scrollTop - target.clientHeight < 100;

    setShowScrollButton(!isNearBottom);
  }, []);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  // Update conversation in state AND localStorage
  const updateConversation = useCallback(
    (conversationId: string, newMessages: ConversationMessage[]) => {
      setConversations((prev) => {
        const existing = prev.find((c) => c.id === conversationId);
        const title =
          existing?.title ||
          newMessages.find((m) => m.role === "user")?.content.slice(0, 50) ||
          "New Chat";

        const updated = {
          id: conversationId,
          title,
          messages: newMessages,
          lastActivityAt: new Date().toISOString(),
        };

        const newConversations = existing
          ? prev.map((c) => (c.id === conversationId ? updated : c))
          : [updated, ...prev];

        // Sync to localStorage immediately
        saveToStorage(newConversations);

        return newConversations;
      });
    },
    [],
  );

  const { sendMessage, isPending } = useGabayChat({
    onSuccess: (response) => {
      if (response.success && response.message) {
        const aiMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        };

        const newMessages = [...messages, aiMessage];

        setMessages(newMessages);

        // Update session - backend returns sessionId
        const sessionId = response.sessionId || currentSessionId;

        if (sessionId) {
          updateConversation(sessionId, newMessages);
          setCurrentSessionId(sessionId);
        }

        // Auto-scroll after message
        requestAnimationFrame(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
      } else if (response.blocked || response.error) {
        const errorMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content:
            response.blockReason ||
            response.error ||
            "Sorry, I encountered an error.",
          timestamp: new Date(),
          error: response.blockReason || response.error,
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

  const handleSendMessage = useCallback(
    (text: string) => {
      const userMessage: ConversationMessage = {
        id: crypto.randomUUID(),
        role: "user",
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);

      // Send to API with sessionId (backend loads history from S3)
      sendMessage({
        message: text,
        sessionId: currentSessionId,
      });

      // Auto-scroll
      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [currentSessionId, sendMessage],
  );

  const handleNewConversation = useCallback(() => {
    setCurrentSessionId(undefined);
    setMessages([]);
  }, []);

  const handleSelectConversation = useCallback(
    (id: string) => {
      const conversation = conversations.find((c) => c.id === id);

      if (conversation) {
        setCurrentSessionId(id);
        setMessages(
          conversation.messages.map((m) => ({
            ...m,
            timestamp: new Date(m.timestamp),
          })),
        );
      }
    },
    [conversations],
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      setConversations((prev) => {
        const updated = prev.filter((c) => c.id !== id);

        saveToStorage(updated);

        return updated;
      });
      if (currentSessionId === id) {
        handleNewConversation();
      }
    },
    [currentSessionId, handleNewConversation],
  );

  const conversationList: Conversation[] = conversations.map((c) => ({
    id: c.id,
    title: c.title,
    lastMessage: c.messages[c.messages.length - 1]?.content,
    lastActivityAt: new Date(c.lastActivityAt),
    messageCount: c.messages.length,
  }));

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversationList}
        currentConversationId={currentSessionId}
        isOpen={isSidebarOpen}
        onDeleteConversation={handleDeleteConversation}
        onNewConversation={handleNewConversation}
        onSelectConversation={handleSelectConversation}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4 py-3 dark:border-gray-700 dark:bg-gray-900">
          <button
            className="rounded-lg p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <MenuIcon className="h-5 w-5" />
          </button>
          <h2 className="text-lg font-semibold">
            {messages.length > 0
              ? conversations.find((c) => c.id === currentSessionId)?.title ||
                "New Chat"
              : "AI Gabay"}
          </h2>
        </div>

        {/* Messages */}
        <div
          className="flex-1 overflow-y-auto px-4 py-6 bg-gradient-to-b from-adult-green/10 to-white"
          onScroll={handleScroll}
        >
          <div className="mx-auto max-w-3xl space-y-6">
            {messages.length === 0 && <AgentWelcome />}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                error={message.error}
                id={message.id}
                isUser={message.role === "user"}
                message={message.content}
                timestamp={message.timestamp}
              />
            ))}

            {isPending && (
              <div className="flex w-full justify-start">
                <div className="flex items-center gap-2 rounded-2xl bg-gray-100 px-4 py-3 text-sm dark:bg-gray-800">
                  <div className="flex gap-1">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.3s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 [animation-delay:-0.15s]" />
                    <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndCallback} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Scroll Button */}
        {showScrollButton && (
          <button
            className="absolute bottom-32 right-8 rounded-full bg-gray-200 p-2 shadow-lg hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
            onClick={scrollToBottom}
          >
            <ArrowDownIcon className="h-5 w-5" />
          </button>
        )}

        {/* Input */}
        <div className="bg-white px-4 py-6">
          <div className="mx-auto max-w-4xl space-y-4">
            {messages.length === 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 px-4">
                {INITIAL_SUGGESTIONS.map((suggestion) => (
                  <SuggestionButton
                    key={suggestion}
                    text={suggestion}
                    onClick={() => handleSendMessage(suggestion)}
                  />
                ))}
              </div>
            )}

            <ChatInput disabled={isPending} onSubmit={handleSendMessage} />
          </div>
        </div>
      </div>
    </div>
  );
}
