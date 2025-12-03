"use client";

import { memo, useState } from "react";
import dynamic from "next/dynamic";
import {
  CheckIcon,
  ClipboardIcon,
  RefreshCwIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from "lucide-react";
import remarkGfm from "remark-gfm";

const ReactMarkdown = dynamic(() => import("react-markdown"), {
  ssr: false,
  loading: () => <div className="animate-pulse bg-gray-200 h-4 rounded" />,
});

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
  isLoading,
  error,
  onRegenerate,
}: ChatMessageOptimizedProps) {
  const [copied, setCopied] = useState(false);
  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = () => {
    setFeedback(feedback === "like" ? null : "like");
  };

  const handleDislike = () => {
    setFeedback(feedback === "dislike" ? null : "dislike");
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
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </div>
            <div className="flex-1">
              <div className="prose prose-sm dark:prose-invert max-w-none prose-ul:my-2 prose-ol:my-2 prose-li:my-1">
                <ReactMarkdown
                  components={{
                    ol: ({ node: _node, ...props }) => (
                      <ol
                        className="list-decimal list-inside space-y-1 my-2"
                        {...props}
                      />
                    ),
                    ul: ({ node: _node, ...props }) => (
                      <ul
                        className="list-disc list-inside space-y-1 my-2"
                        {...props}
                      />
                    ),
                    li: ({ node: _node, ...props }) => (
                      <li className="ml-0" {...props} />
                    ),
                    strong: ({ node: _node, ...props }) => (
                      <strong
                        className="font-semibold text-gray-900 dark:text-white"
                        {...props}
                      />
                    ),
                  }}
                  remarkPlugins={[remarkGfm]}
                >
                  {message}
                </ReactMarkdown>
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
                  className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  title="Copy message"
                  onClick={handleCopy}
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <ClipboardIcon className="h-4 w-4" />
                  )}
                </button>

                <button
                  className={`rounded p-1 transition-colors ${
                    feedback === "like"
                      ? "text-green-600 bg-green-50 hover:bg-green-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  }`}
                  title="Like this response"
                  onClick={handleLike}
                >
                  <ThumbsUpIcon className="h-4 w-4" />
                </button>

                <button
                  className={`rounded p-1 transition-colors ${
                    feedback === "dislike"
                      ? "text-red-600 bg-red-50 hover:bg-red-100"
                      : "text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                  }`}
                  title="Dislike this response"
                  onClick={handleDislike}
                >
                  <ThumbsDownIcon className="h-4 w-4" />
                </button>

                {onRegenerate && !isLoading && (
                  <button
                    className="rounded p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300"
                    title="Regenerate response"
                    onClick={onRegenerate}
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
