"use client";

import { useState, useCallback, useRef, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MenuIcon, Trash2Icon, MoreVerticalIcon } from "lucide-react";
import { ChatMessage } from "./ChatMessage";
import { AgentWelcome } from "./AgentWelcome";
import { SuggestionButton } from "./SuggestionButton";
import { ChatInput } from "./ChatInput";
import { ConversationSidebar } from "./ConversationSidebar";
import {
  useGabayChat,
  useRenameConversation,
  useDeleteConversation,
  useGabayConversations,
  useGabayConversationMessages,
} from "@/hooks/queries/useGabayQueries";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import type { ConversationMessage, Conversation } from "@/types/gabay";
import { logger } from "@/lib/logger";

const INITIAL_SUGGESTIONS = [
  "Requirements for Postal ID",
  "Where can I get an NBI Clearance",
  "Help me find a job",
  "How do I apply for SSS?",
];

export function ChatContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>(
    () => searchParams.get("c") || undefined,
  );
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const optionsMenuRef = useRef<HTMLDivElement>(null);
  const isCreatingConversationRef = useRef(false);

  const {
    data: conversationsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchConversations,
  } = useGabayConversations();

  const { data: loadedMessages } =
    useGabayConversationMessages(currentSessionId);

  const [localMessages, setLocalMessages] = useState<ConversationMessage[]>([]);

  const messages = useMemo(() => {
    // Always prioritize local messages if they exist (ongoing conversation)
    if (localMessages.length > 0) {
      return localMessages;
    }

    // Otherwise show loaded history
    if (loadedMessages && loadedMessages.length > 0) {
      return loadedMessages.map(
        (m, index): ConversationMessage => ({
          id: `${currentSessionId}-${index}`,
          role: m.role,
          content: m.content,
          timestamp: new Date(m.timestamp),
        }),
      );
    }

    return [];
  }, [localMessages, loadedMessages, currentSessionId]);

  const messagesEndCallback = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      node.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  const handleScroll = useCallback(
    (_e: React.UIEvent<HTMLDivElement>) => {},
    [],
  );

  const { renameConversation } = useRenameConversation({
    onSuccess: () => {
      refetchConversations();
    },
    onError: (error) => {
      logger.error("[GABAY] Failed to rename conversation:", error);
    },
  });

  const { deleteConversation } = useDeleteConversation({
    onSuccess: () => {
      refetchConversations();
    },
    onError: (error) => {
      logger.error("[GABAY] Failed to delete conversation:", error);
    },
  });

  const { sendMessage, isPending } = useGabayChat({
    onSuccess: (response) => {
      if (response.success && response.message) {
        const aiMessage: ConversationMessage = {
          id: crypto.randomUUID(),
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        };

        setLocalMessages((prev) => [...prev, aiMessage]);

        const sessionId = response.sessionId || currentSessionId;

        if (sessionId) {
          // For new conversations, update URL and state together
          if (!currentSessionId && sessionId) {
            isCreatingConversationRef.current = true;
            setCurrentSessionId(sessionId);
            router.replace(`/ai-gabay?c=${sessionId}`, { scroll: false });
            // Reset flag after navigation completes
            setTimeout(() => {
              isCreatingConversationRef.current = false;
            }, 100);
          } else if (currentSessionId !== sessionId) {
            setCurrentSessionId(sessionId);
          }

          refetchConversations();
        }

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

        setLocalMessages((prev) => [...prev, errorMessage]);
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

      setLocalMessages((prev) => [...prev, errorMessage]);
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

      setLocalMessages((prev) => {
        if (prev.length === 0 && loadedMessages && loadedMessages.length > 0) {
          const historyMessages = loadedMessages.map(
            (m, index): ConversationMessage => ({
              id: `${currentSessionId}-${index}`,
              role: m.role,
              content: m.content,
              timestamp: new Date(m.timestamp),
            }),
          );

          return [...historyMessages, userMessage];
        }

        return [...prev, userMessage];
      });

      sendMessage({
        message: text,
        sessionId: currentSessionId,
      });

      requestAnimationFrame(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      });
    },
    [currentSessionId, sendMessage, loadedMessages],
  );

  const handleNewConversation = useCallback(() => {
    setCurrentSessionId(undefined);
    setLocalMessages([]);
    router.push("/ai-gabay");
  }, [router]);

  const handleSelectConversation = useCallback(
    (id: string) => {
      setCurrentSessionId(id);
      setLocalMessages([]);
      router.push(`/ai-gabay?c=${id}`);
    },
    [router],
  );

  const handleRenameConversation = useCallback(
    (id: string, newTitle: string) => {
      renameConversation({ sessionId: id, newTopic: newTitle });
    },
    [renameConversation],
  );

  const handleDeleteConversation = useCallback(
    (id: string) => {
      deleteConversation(id);
      if (currentSessionId === id) {
        handleNewConversation();
      }
    },
    [deleteConversation, currentSessionId, handleNewConversation],
  );

  const handleDeleteConfirm = useCallback(() => {
    if (currentSessionId) {
      handleDeleteConversation(currentSessionId);
    }
    setShowDeleteModal(false);
  }, [currentSessionId, handleDeleteConversation]);

  const handleDeleteCancel = useCallback(() => {
    setShowDeleteModal(false);
  }, []);

  const handleOptionsClick = useCallback(() => {
    setShowOptionsMenu(!showOptionsMenu);
  }, [showOptionsMenu]);

  const handleNewFromMenu = useCallback(() => {
    handleNewConversation();
    setShowOptionsMenu(false);
  }, [handleNewConversation]);

  const handleDeleteFromMenu = useCallback(() => {
    setShowOptionsMenu(false);
    setShowDeleteModal(true);
  }, []);

  useEffect(() => {
    // Skip if we're in the middle of creating a new conversation
    if (isCreatingConversationRef.current) {
      return;
    }

    const urlConversationId = searchParams.get("c");

    if (urlConversationId !== currentSessionId) {
      if (urlConversationId) {
        // Switching to a different existing conversation
        if (currentSessionId && currentSessionId !== urlConversationId) {
          setIsLoadingHistory(true);
          setLocalMessages([]);
        }
        setCurrentSessionId(urlConversationId);
      } else if (currentSessionId) {
        // Going back to home (no conversation)
        setCurrentSessionId(undefined);
        setLocalMessages([]);
      }
    }
  }, [searchParams, currentSessionId]);

  // Reset loading state when messages are loaded
  useEffect(() => {
    if (loadedMessages && isLoadingHistory) {
      setIsLoadingHistory(false);
    }
  }, [loadedMessages, isLoadingHistory]);

  // Handle click outside options menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        optionsMenuRef.current &&
        !optionsMenuRef.current.contains(event.target as Node)
      ) {
        setShowOptionsMenu(false);
      }
    };

    if (showOptionsMenu) {
      document.addEventListener("mousedown", handleClickOutside);

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [showOptionsMenu]);

  const conversationList: Conversation[] =
    conversationsData?.pages
      .flatMap((page) => page.conversations)
      .map((c) => ({
        id: c.sessionId,
        title: c.topic,
        lastMessage: c.lastMessage,
        lastActivityAt: new Date(c.startedAt),
        messageCount: c.messageCount,
      })) || [];

  // Get current conversation title
  const currentConversation = conversationList.find(
    (c) => c.id === currentSessionId,
  );
  const conversationTitle =
    currentConversation?.title || (messages.length > 0 ? "AI Gabay Chat" : "");

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <ConversationSidebar
        conversations={conversationList}
        currentConversationId={currentSessionId}
        hasMore={hasNextPage}
        isLoading={isFetchingNextPage}
        isOpen={isSidebarOpen}
        onDeleteConversation={handleDeleteConversation}
        onLoadMore={fetchNextPage}
        onNewConversation={handleNewConversation}
        onRenameConversation={handleRenameConversation}
        onSelectConversation={handleSelectConversation}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      {/* Main Chat Area */}
      <div className="flex flex-1 flex-col bg-gradient-to-b from-adult-green/10 to-white">
        {/* Header - Only show when there are messages */}
        {messages.length > 0 && (
          <div className="bg-gradient-to-b from-purple-50/90 to-white/80 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4 border-b border-white/30 shadow-sm">
            <div className="flex items-center justify-between">
              {/* Left side - Hamburger and Title */}
              <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                {/* Hamburger menu for mobile */}
                <button
                  className="md:hidden p-2 sm:p-2.5 rounded-xl text-gray-600 hover:text-adult-green hover:bg-adult-green/10 transition-all duration-200 flex-shrink-0"
                  title="Toggle menu"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                >
                  <MenuIcon className="h-4 w-4 sm:h-5 sm:w-5" />
                </button>

                {/* Conversation Title */}
                {conversationTitle && (
                  <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1 overflow-hidden">
                    <div className="p-1.5 sm:p-2 rounded-lg flex-shrink-0">
                      <svg
                        className="text-adult-green sm:w-4 sm:h-4"
                        fill="none"
                        height="14"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="14"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z" />
                        <path d="M20 2v4" />
                        <path d="M22 4h-4" />
                        <circle cx="4" cy="20" r="2" />
                      </svg>
                    </div>
                    <h1 className="text-sm sm:text-lg font-semibold text-gray-900 truncate min-w-0">
                      {conversationTitle}
                    </h1>
                  </div>
                )}
              </div>

              {/* Right side - Options menu */}
              <div ref={optionsMenuRef} className="relative flex-shrink-0">
                <button
                  className="flex items-center justify-center p-1.5 sm:p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-all duration-200"
                  title="Options"
                  onClick={handleOptionsClick}
                >
                  <MoreVerticalIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                </button>

                {/* Options dropdown */}
                {showOptionsMenu && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    <button
                      className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      onClick={handleNewFromMenu}
                    >
                      <svg
                        className="text-adult-green"
                        fill="none"
                        height="16"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        width="16"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719" />
                        <path d="M8 12h8" />
                        <path d="M12 8v8" />
                      </svg>
                      New Chat
                    </button>
                    {currentSessionId && (
                      <button
                        className="flex w-full items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
                        onClick={handleDeleteFromMenu}
                      >
                        <Trash2Icon className="h-4 w-4" />
                        Delete
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Mobile hamburger for welcome screen */}
        {messages.length === 0 && (
          <div className="md:hidden absolute top-3 left-3 z-10">
            <button
              className="p-2 rounded-lg text-gray-600 hover:text-gray-800 hover:bg-white/50 transition-colors"
              title="Toggle menu"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <MenuIcon className="h-5 w-5" />
            </button>
          </div>
        )}

        {/* Messages */}
        <div
          className={`flex-1 overflow-y-auto px-4 sm:px-6 py-4 sm:py-6 ${messages.length === 0 ? "flex items-center justify-center min-h-[600px]" : ""}`}
          onScroll={handleScroll}
        >
          <div className="mx-auto max-w-4xl space-y-4 sm:space-y-6 w-full">
            {messages.length === 0 && (
              <div className="space-y-6 sm:space-y-8 w-full">
                <AgentWelcome />
                <div className="px-2">
                  <ChatInput
                    disabled={isPending}
                    isLoading={isPending}
                    onSubmit={handleSendMessage}
                  />
                </div>

                {/* AI Disclaimer for new chat */}
                <div className="px-2 sm:px-4 -mt-2 sm:-mt-4">
                  <p className="text-xs text-gray-500 text-center mb-4 sm:mb-6">
                    AI Gabay can make mistakes. Please verify important
                    information.
                  </p>
                </div>

                <div className="px-2">
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    {INITIAL_SUGGESTIONS.map((suggestion) => (
                      <SuggestionButton
                        key={suggestion}
                        text={suggestion}
                        onClick={() => handleSendMessage(suggestion)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

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

        {/* Input - Only shown when there are messages */}
        {messages.length > 0 && (
          <div className="bg-transparent px-4 sm:px-6 py-4 sm:py-6">
            <div className="mx-auto max-w-4xl px-2">
              <ChatInput
                disabled={isPending}
                isLoading={isPending}
                onSubmit={handleSendMessage}
              />
            </div>
          </div>
        )}

        {/* AI Disclaimer - Only show when there are messages */}
        {messages.length > 0 && (
          <div className="bg-transparent px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-100/50">
            <div className="mx-auto max-w-4xl px-2">
              <p className="text-xs text-gray-500 text-center">
                AI Gabay can make mistakes. Please verify important information
                and consider checking with official sources for critical
                decisions.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          backdrop: "backdrop-blur-md bg-black/30 z-[9999] fixed inset-0",
          wrapper: "z-[10000]",
          base: "z-[10001]",
        }}
        isOpen={showDeleteModal}
        placement="center"
        portalContainer={
          typeof window !== "undefined" ? document.body : undefined
        }
        size="sm"
        onClose={handleDeleteCancel}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 px-6 pt-6 pb-2">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Conversation
            </h3>
          </ModalHeader>
          <ModalBody className="px-6 py-2">
            <div className="text-center">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-red-100">
                <Trash2Icon className="w-6 h-6 text-red-600" />
              </div>
              <p className="text-sm text-gray-600">
                Are you sure you want to delete &quot;{conversationTitle}&quot;?
                This action cannot be undone.
              </p>
            </div>
          </ModalBody>
          <ModalFooter className="px-6 py-6 flex justify-end">
            <div className="flex items-center gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                onClick={handleDeleteCancel}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors"
                onClick={handleDeleteConfirm}
              >
                Delete
              </button>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
