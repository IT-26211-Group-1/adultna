"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon } from "@/components/ui/Icons";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask me anything",
  className,
}: ChatInputProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSubmit(input.trim());
      setInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative", className)}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={cn(
            "w-full rounded-full border border-gray-300 bg-white py-3 pl-12 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-adultGreen focus:outline-none focus:ring-2 focus:ring-adultGreen/20 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500"
          )}
        />
      </div>
    </form>
  );
}
