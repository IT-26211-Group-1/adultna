"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, ArrowRightIcon } from "lucide-react";

interface ChatInputProps {
  onSubmit: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  className?: string;
}

export function ChatInput({
  onSubmit,
  disabled = false,
  placeholder = "Ask whatever you want",
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
    <form className={cn("relative", className)} onSubmit={handleSubmit}>
      <div className="relative flex items-center">
        <SearchIcon className="absolute left-4 h-5 w-5 text-gray-400" />
        <input
          className={cn(
            "w-full rounded-full border border-gray-200 bg-white py-4 pl-12 pr-14 text-sm text-gray-900 placeholder-gray-400 focus:border-gray-300 focus:outline-none focus:ring-0 shadow-sm disabled:cursor-not-allowed disabled:opacity-50",
          )}
          disabled={disabled}
          placeholder={placeholder}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          type="submit"
          disabled={!input.trim() || disabled}
          className={cn(
            "absolute right-2 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed",
            input.trim() && !disabled && "bg-adult-green/80 hover:bg-adult-green/100 text-white"
          )}
        >
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </form>
  );
}
