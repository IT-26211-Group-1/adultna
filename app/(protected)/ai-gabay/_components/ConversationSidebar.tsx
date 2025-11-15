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
    <aside className="flex h-full w-80 flex-col bg-gradient-to-b from-purple-50/80 to-white/90 backdrop-blur-sm border-r border-white/30">
      {/* New Chat Button */}
      <div className="p-4">
        <button
          className="flex w-full items-center gap-3 rounded-2xl bg-gradient-to-r from-adult-green to-adult-green/80 px-6 py-3.5 text-sm font-semibold text-white transition-all hover:shadow-md hover:scale-[1.02]"
          onClick={onNewConversation}
        >
          <PlusIcon className="h-4 w-4" />
          New Chat
        </button>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {conversations.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <div className="rounded-2xl bg-white/60 p-6 backdrop-blur-sm">
              <MessageSquareIcon className="mx-auto mb-3 h-8 w-8 text-gray-400" />
              <p className="text-sm font-medium text-gray-600">No conversations yet</p>
              <p className="text-xs text-gray-500 mt-1">Start a new chat to begin!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {conversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`group relative rounded-2xl backdrop-blur-sm transition-all ${
                  currentConversationId === conversation.id
                    ? "bg-white/80 shadow-md"
                    : "bg-white/40 hover:bg-white/60 hover:shadow-sm"
                }`}
              >
                <button
                  className="flex w-full items-start gap-3 p-4 text-left"
                  onClick={() => onSelectConversation(conversation.id)}
                >
                  <div className={`mt-1 rounded-lg p-2 ${
                    currentConversationId === conversation.id
                      ? "bg-gradient-to-r from-adult-green/10 to-purple-100"
                      : "bg-gray-100"
                  }`}>
                    <MessageSquareIcon className={`h-4 w-4 ${
                      currentConversationId === conversation.id
                        ? "text-adult-green"
                        : "text-gray-600"
                    }`} />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <div className={`truncate font-semibold text-sm ${
                      currentConversationId === conversation.id
                        ? "text-gray-800"
                        : "text-gray-700"
                    }`}>
                      {conversation.title}
                    </div>
                    {conversation.lastMessage && (
                      <div className="truncate text-xs text-gray-500 mt-1">
                        {conversation.lastMessage}
                      </div>
                    )}
                  </div>
                </button>

                {/* Delete Button */}
                <button
                  className="absolute top-3 right-3 rounded-lg p-2 opacity-0 transition-all hover:bg-red-50 hover:text-red-600 group-hover:opacity-100"
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
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
});
