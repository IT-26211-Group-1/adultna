"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, ArrowRightIcon, Loader2Icon } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
  isLoading?: boolean;
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask whatever you want",
  className,
  isLoading = false,
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
    <form className={cn("relative", className)} onSubmit={handleSubmit}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-3 sm:left-4 h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        <input
          className={cn(
            "w-full rounded-full border-2 border-gray-300/60 bg-white/90 backdrop-blur-md py-3 sm:py-4 pl-10 sm:pl-12 pr-12 sm:pr-14 text-sm text-gray-900 placeholder-gray-500 focus:border-adult-green focus:outline-none focus:ring-0 focus:bg-white disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          )}
          disabled={disabled}
          placeholder={placeholder}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          className={cn(
            "absolute right-1.5 sm:right-2 rounded-full bg-gray-100 p-1.5 sm:p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed",
            input.trim() &&
              !disabled &&
              "bg-adult-green/80 hover:bg-adult-green/100 text-white",
          )}
          disabled={!input.trim() || disabled}
          type="submit"
        >
          {isLoading ? (
            <Loader2Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4 animate-spin" />
          ) : (
            <ArrowRightIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          )}
        </button>
      </div>
    </form>
  );
}
