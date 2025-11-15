"use client";

import { memo, useState, useRef, useEffect } from "react";
import { PlusIcon, MessageSquareIcon, Home, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import type { Conversation } from "@/types/gabay";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const ConversationSidebar = memo(function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  isOpen,
  onToggleSidebar,
}: ConversationSidebarProps) {
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteModal(conversationId);
  };

  const handleDeleteConfirm = (conversationId: string) => {
    onDeleteConversation(conversationId);
    setShowDeleteModal(null);
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(null);
  };

  return (
    <aside
      className={`flex h-full flex-col bg-gradient-to-b from-purple-50/80 to-white/90 backdrop-blur-sm border-r border-white/30 transition-all duration-500 ease-in-out ${
        isOpen ? "w-80" : "w-20"
      }`}
    >
      {/* Logo Section */}
      <div className="flex flex-col items-center pt-6 pb-3">
        {isOpen ? (
          <div className="w-full px-4 mb-3 flex items-center gap-3">
            <button
              onClick={onToggleSidebar}
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
              title="Close Sidebar"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5 text-gray-700"
              >
                <rect width="18" height="18" x="3" y="3" rx="2"/>
                <path d="M15 3v18"/>
              </svg>
            </button>
            <div className="flex-1 min-w-0">
              <Image
                src="/Logo.png"
                alt="AdultNa Logo"
                width={100}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </div>
          </div>
        ) : (
          <button
            onClick={onToggleSidebar}
            className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
            title="Open Sidebar"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-5 w-5 text-gray-700"
            >
              <rect width="18" height="18" x="3" y="3" rx="2"/>
              <path d="M15 3v18"/>
            </svg>
          </button>
        )}
      </div>

      {/* Action Icons */}
      <div className={`flex flex-col pb-3 transition-all duration-500 ease-in-out ${isOpen ? "px-6 items-start space-y-3" : "items-center space-y-5"}`}>
        {/* New Chat Button */}
        <button
          className={`flex items-center justify-start text-gray-700 ${
            isOpen ? "w-full h-10 gap-2" : "h-6 w-6 justify-center"
          }`}
          onClick={onNewConversation}
          title="New Chat"
        >
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-adult-green to-adult-green/80 text-white flex-shrink-0">
            <PlusIcon className="h-4 w-4" />
          </div>
          {isOpen && <span className="text-sm font-medium">New Chat</span>}
        </button>

        {/* Back to Dashboard Button */}
        <Link
          href="/dashboard"
          className={`flex items-center justify-start text-gray-700 hover:text-adult-green ${
            isOpen ? "w-full h-10 gap-2" : "h-6 w-6 justify-center"
          }`}
          title="Back to Dashboard"
        >
          <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 flex-shrink-0">
            <Home className="h-4 w-4" />
          </div>
          {isOpen && <span className="text-sm font-medium">Dashboard</span>}
        </Link>
      </div>

      {/* Conversations List */}
      {isOpen && (
        <div className="flex-1 overflow-y-auto px-4 pb-4">
          <div className="mb-3 px-2 pt-4">
            <h3 className="text-sm font-medium text-gray-600">Recent Conversations</h3>
          </div>
          <div className="space-y-0">
            {conversations.map((conversation, index) => (
              <div key={conversation.id}>
                <div className="group relative" data-conversation-id={conversation.id}>
                  <button
                    className={`flex w-full items-center gap-3 p-3 text-left transition-all ${
                      currentConversationId === conversation.id
                        ? "text-adult-green"
                        : "text-gray-700 hover:text-adult-green"
                    }`}
                    onClick={() => onSelectConversation(conversation.id)}
                    title={conversation.title}
                  >
                    <MessageSquareIcon className="h-4 w-4 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{conversation.title}</p>
                      {conversation.lastMessage && (
                        <p className="text-xs opacity-75 truncate mt-1">
                          {conversation.lastMessage}
                        </p>
                      )}
                    </div>
                  </button>

                  {/* Options Button - shows on hover with gradient overlay */}
                  {currentConversationId !== conversation.id && (
                    <div className="absolute inset-y-0 right-0 w-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                      <div className="absolute inset-0 bg-gradient-to-l from-purple-50/90 via-purple-50/60 to-transparent"></div>
                      <button
                        className="absolute inset-y-0 right-3 flex items-center justify-center w-8 h-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
                        onClick={(e) => handleDeleteClick(conversation.id, e)}
                        title="More options"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-5 h-5"
                        >
                          <circle cx="5" cy="12" r="2.5"/>
                          <circle cx="12" cy="12" r="2.5"/>
                          <circle cx="19" cy="12" r="2.5"/>
                        </svg>
                      </button>
                    </div>
                  )}

                  {/* Dropdown Menu - positioned below the three dots */}
                  {showDeleteModal === conversation.id && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={handleDeleteCancel}></div>
                      <div className="absolute top-full right-3 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] mt-1">
                        <button
                          onClick={() => handleDeleteConfirm(showDeleteModal)}
                          className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </>
                  )}
                </div>
                {index < conversations.length - 1 && (
                  <div className="mx-3 border-b border-gray-200/50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
});
