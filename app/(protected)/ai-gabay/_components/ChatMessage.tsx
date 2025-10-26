"use client";

import { memo, useState } from "react";
import { CheckIcon, ClipboardIcon, RefreshCwIcon } from "lucide-react";
import ReactMarkdown from "react-markdown";

type ChatMessageOptimizedProps = {
  id: string;
  isUser: boolean;
  message: string;
  timestamp: Date;
  isLoading?: boolean;
  error?: string;
  onRegenerate?: () => void;
};

export const ChatMessage = memo(function ChatMessageOptimized({
  isUser,
  message,
  timestamp,
  isLoading,
  error,
  onRegenerate,
}: ChatMessageOptimizedProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`group relative max-w-[85%] ${
          isUser ? "rounded-2xl bg-[#11553F] px-4 py-3 text-white" : "space-y-2"
        }`}
      >
        {/* Assistant Avatar */}
        {!isUser && (
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{message}</ReactMarkdown>
              </div>

              {/* Error state */}
              {error && (
                <div className="mt-2 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              {/* Message Actions */}
              <div className="mt-2 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  onClick={handleCopy}
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  title="Copy message"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </button>

                {onRegenerate && !isLoading && (
                  <button
                    onClick={onRegenerate}
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="Regenerate response"
                  >
                    <RefreshCwIcon className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* User Message */}
        {isUser && <div className="text-sm">{message}</div>}
      </div>
    </div>
  );
});
