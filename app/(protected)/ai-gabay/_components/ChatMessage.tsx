"use client";

import { cn } from "@/lib/utils";

interface ChatMessageProps {
  message: string;
  isUser?: boolean;
  className?: string;
}

export function ChatMessage({
  message,
  isUser = false,
  className,
}: ChatMessageProps) {
  if (isUser) {
    // User message - right aligned with avatar
    return (
      <div className="flex w-full justify-end gap-3">
        <div
          className={cn(
            "max-w-[70%] rounded-2xl bg-adultGreen px-4 py-3 text-sm text-black shadow-sm",
            className
          )}
        >
          <p className="whitespace-pre-wrap break-words">{message}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-adultGreen text-white shadow-sm">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
            />
          </svg>
        </div>
      </div>
    );
  }

  // AI message - left aligned with avatar
  return (
    <div className="flex w-full justify-start gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-adultGreen text-white shadow-sm">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-6 w-6"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.625 9.75a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 0 1 .778-.332 48.294 48.294 0 0 0 5.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
          />
        </svg>
      </div>
      <div
        className={cn(
          "max-w-[70%] rounded-2xl bg-gray-100 px-4 py-3 text-sm text-black shadow-sm dark:bg-gray-800 dark:text-black",
          className
        )}
      >
        <p className="whitespace-pre-wrap break-words">{message}</p>
      </div>
    </div>
  );
}
