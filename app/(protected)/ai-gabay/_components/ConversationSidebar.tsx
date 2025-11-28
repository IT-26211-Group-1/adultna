"use client";

import { memo, useState, useEffect, useRef } from "react";
import {
  PlusIcon,
  MessageSquareIcon,
  Home,
  Trash2,
  Pencil,
} from "lucide-react";
import Link from "next/link";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/modal";
import type { Conversation } from "@/types/gabay";

import { OptimizedImage } from "@/components/ui/OptimizedImage";

interface ConversationSidebarProps {
  conversations: Conversation[];
  currentConversationId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const ConversationSidebar = memo(function ConversationSidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isOpen,
  onToggleSidebar,
}: ConversationSidebarProps) {
  const [showDeleteDropdown, setShowDeleteDropdown] = useState<string | null>(
    null,
  );
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDeleteClick = (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowDeleteDropdown(conversationId);
  };

  const handleDeleteOptionClick = (conversationId: string) => {
    setShowDeleteDropdown(null);
    setShowDeleteModal(conversationId);
  };

  const handleDeleteConfirm = () => {
    if (showDeleteModal) {
      onDeleteConversation(showDeleteModal);
      setShowDeleteModal(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(null);
  };

  const handleDropdownCancel = () => {
    setShowDeleteDropdown(null);
  };

  const handleRenameClick = (conversation: Conversation) => {
    setShowDeleteDropdown(null);
    setEditingId(conversation.id);
    setEditValue(conversation.title);
  };

  const handleRenameSubmit = (conversationId: string) => {
    if (
      editValue.trim() &&
      editValue !== conversations.find((c) => c.id === conversationId)?.title
    ) {
      onRenameConversation(conversationId, editValue.trim());
    }
    setEditingId(null);
    setEditValue("");
  };

  const handleRenameCancel = () => {
    setEditingId(null);
    setEditValue("");
  };

  useEffect(() => {
    if (editingId && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [editingId]);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
          role="button"
          tabIndex={0}
          onClick={onToggleSidebar}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              onToggleSidebar();
            }
          }}
        />
      )}

      <aside
        className={`flex h-full flex-col bg-gradient-to-b from-purple-50/80 to-white/90 backdrop-blur-sm border-r border-white/30 transition-all duration-500 ease-in-out
          ${
            isOpen
              ? "w-80 fixed md:relative left-0 top-0 z-50 md:z-auto md:translate-x-0"
              : "w-80 md:w-20 fixed md:relative -translate-x-full md:translate-x-0"
          }`}
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center pt-6 pb-3">
          {isOpen ? (
            <div className="w-full px-4 mb-3 flex items-center gap-3">
              <button
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
                title="Close Sidebar"
                onClick={onToggleSidebar}
              >
                <svg
                  className="h-5 w-5 text-gray-700"
                  fill="none"
                  height="20"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <rect height="18" rx="2" width="18" x="3" y="3" />
                  <path d="M15 3v18" />
                </svg>
              </button>
              <div className="flex-1 min-w-0">
                <OptimizedImage
                  priority
                  alt="AdultNa Logo"
                  className="h-7 w-auto object-contain"
                  height={28}
                  sizes="100px"
                  src="/Logo.png"
                  width={100}
                />
              </div>
            </div>
          ) : (
            <button
              className="mb-3 flex h-8 w-8 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm transition-all hover:bg-white/30 hover:scale-105"
              title="Open Sidebar"
              onClick={onToggleSidebar}
            >
              <svg
                className="h-5 w-5 text-gray-700"
                fill="none"
                height="20"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                width="20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect height="18" rx="2" width="18" x="3" y="3" />
                <path d="M15 3v18" />
              </svg>
            </button>
          )}
        </div>

        {/* Action Icons */}
        <div
          className={`flex flex-col pb-3 transition-all duration-500 ease-in-out ${isOpen ? "px-6 items-start space-y-3" : "items-center space-y-5"}`}
        >
          {/* New Chat Button */}
          <button
            className={`flex items-center justify-start text-gray-700 ${
              isOpen ? "w-full h-10 gap-2" : "h-6 w-6 justify-center"
            }`}
            title="New Chat"
            onClick={onNewConversation}
          >
            <div className="h-6 w-6 flex items-center justify-center rounded-full bg-gradient-to-r from-adult-green to-adult-green/80 text-white flex-shrink-0">
              <PlusIcon className="h-4 w-4" />
            </div>
            {isOpen && <span className="text-sm font-medium">New Chat</span>}
          </button>

          {/* Back to Dashboard Button */}
          <Link
            className={`flex items-center justify-start text-gray-700 hover:text-adult-green ${
              isOpen ? "w-full h-10 gap-2" : "h-6 w-6 justify-center"
            }`}
            href="/dashboard"
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
              <h3 className="text-sm font-medium text-gray-600">
                Recent Conversations
              </h3>
            </div>
            <div className="space-y-0">
              {conversations.map((conversation, index) => (
                <div key={conversation.id}>
                  <div
                    className="group relative"
                    data-conversation-id={conversation.id}
                  >
                    {editingId === conversation.id ? (
                      <div className="flex w-full items-center gap-2 p-3">
                        <MessageSquareIcon className="h-4 w-4 flex-shrink-0 text-gray-600" />
                        <input
                          ref={inputRef}
                          className="flex-1 text-sm font-medium bg-white border border-adult-green rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-adult-green/20"
                          type="text"
                          value={editValue}
                          onBlur={() => handleRenameSubmit(conversation.id)}
                          onChange={(e) => setEditValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              handleRenameSubmit(conversation.id);
                            } else if (e.key === "Escape") {
                              handleRenameCancel();
                            }
                          }}
                        />
                      </div>
                    ) : (
                      <button
                        className={`flex w-full items-center gap-3 p-3 text-left transition-all rounded-lg ${
                          currentConversationId === conversation.id
                            ? "bg-adult-green/10 text-adult-green shadow-sm"
                            : "text-gray-700 hover:text-adult-green hover:bg-gray-50/50"
                        }`}
                        title={conversation.title}
                        onClick={() => onSelectConversation(conversation.id)}
                      >
                        <MessageSquareIcon className="h-4 w-4 flex-shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {conversation.title}
                          </p>
                          {conversation.lastMessage && (
                            <p className="text-xs opacity-75 truncate mt-1">
                              {conversation.lastMessage}
                            </p>
                          )}
                        </div>
                      </button>
                    )}

                    {/* Options Button - shows on hover with gradient overlay */}
                    {editingId !== conversation.id && (
                      <div className="absolute inset-y-0 right-0 w-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto">
                        <div
                          className={`absolute inset-0 bg-gradient-to-l ${
                            currentConversationId === conversation.id
                              ? "from-adult-green/10 via-adult-green/5 to-transparent"
                              : "from-purple-50/90 via-purple-50/60 to-transparent"
                          }`}
                        />
                        <button
                          className="absolute inset-y-0 right-3 flex items-center justify-center w-8 h-full text-gray-600 hover:text-gray-800 transition-colors duration-200"
                          title="More options"
                          onClick={(e) => handleDeleteClick(conversation.id, e)}
                        >
                          <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <circle cx="5" cy="12" r="2.5" />
                            <circle cx="12" cy="12" r="2.5" />
                            <circle cx="19" cy="12" r="2.5" />
                          </svg>
                        </button>
                      </div>
                    )}

                    {/* Dropdown Menu - positioned below the three dots */}
                    {showDeleteDropdown === conversation.id && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          role="button"
                          tabIndex={0}
                          onClick={handleDropdownCancel}
                          onKeyDown={(e) => {
                            if (e.key === "Escape" || e.key === "Enter") {
                              handleDropdownCancel();
                            }
                          }}
                        />
                        <div className="absolute top-full right-3 z-50 bg-white rounded-lg shadow-lg border border-gray-200 py-1 min-w-[120px] mt-1">
                          <button
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            onClick={() => handleRenameClick(conversation)}
                          >
                            <Pencil className="w-4 h-4" />
                            Rename
                          </button>
                          <div className="mx-2 border-b border-gray-200/50" />
                          <button
                            className="flex w-full items-center gap-3 px-3 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() =>
                              handleDeleteOptionClick(conversation.id)
                            }
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                  {index < conversations.length - 1 && (
                    <div className="mx-3 border-b border-gray-200/50" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <Modal
          backdrop="blur"
          classNames={{
            backdrop: "backdrop-blur-md bg-black/30 z-[9999] fixed inset-0",
            wrapper: "z-[10000]",
            base: "z-[10001]",
          }}
          isOpen={!!showDeleteModal}
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
                  <Trash2 className="w-6 h-6 text-red-600" />
                </div>
                <p className="text-sm text-gray-600">
                  Are you sure you want to delete this conversation? This action
                  cannot be undone.
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
      </aside>
    </>
  );
});
