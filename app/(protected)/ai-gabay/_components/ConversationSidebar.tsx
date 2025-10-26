"use client";

import { memo } from "react";
import { PlusIcon, MessageSquareIcon, TrashIcon } from "lucide-react";
import type { Conversation } from "@/types/gabay";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
}

export const ConversationSidebar = memo(function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
}: ConversationSidebarProps) {
  if (!isOpen) return null;

  return (
    <aside className="flex h-full w-64 flex-col border-r border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-900">
      {/* New Chat Button */}
      <div className="border-b border-gray-200 p-3 dark:border-gray-700">
        <button
          className="flex w-full items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          onClick={onNewConversation}
        >
          <PlusIcon className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <div className="px-3 py-8 text-center text-sm text-gray-500 dark:text-gray-400">
            No conversations yet.
            <br />
            Start a new chat!
          </div>
        ) : (
          <div className="space-y-1">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                  currentConversationId === conversation.id
                    ? "bg-gray-200 text-gray-900 dark:bg-gray-700 dark:text-gray-100"
                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                }`}
              >
                <button
                  className="flex flex-1 items-start gap-2 overflow-hidden text-left"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <MessageSquareIcon className="mt-0.5 h-4 w-4 shrink-0" />
                  <div className="flex-1 overflow-hidden">
                    <div className="truncate font-medium">
                      {conversation.title}
                    </div>
                    {conversation.lastMessage && (
                      <div className="truncate text-xs opacity-60">
                        {conversation.lastMessage}
                      </div>
                    )}
                  </div>
                </button>

                {/* Delete Button */}

                {/* TODO: Change confirm */}
                <button
                  className="shrink-0 rounded p-1 opacity-0 transition-opacity hover:bg-red-100 hover:text-red-600 group-hover:opacity-100 dark:hover:bg-red-900 dark:hover:text-red-400"
                  title="Delete conversation"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (
                      confirm(
                        "Are you sure you want to delete this conversation? This action cannot be undone.",
                      )
                    ) {
                      onDeleteConversation(conversation.id);
                    }
                  }}
                >
                  <TrashIcon className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});
