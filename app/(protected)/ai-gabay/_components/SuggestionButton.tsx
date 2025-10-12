"use client";

import { cn } from "@/lib/utils";

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

export function SuggestionButton({
  text,
  onClick,
  className,
}: SuggestionButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700",
        className
      )}
    >
      {text}
    </button>
  );
}
