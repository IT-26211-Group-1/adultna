"use client";

import { cn } from "@/lib/utils";
import { FileText, Search, Briefcase, CreditCard } from "lucide-react";

interface SuggestionButtonProps {
  text: string;
  onClick: () => void;
  className?: string;
}

const getIconForText = (text: string) => {
  if (text.includes("Postal ID") || text.includes("NBI")) return FileText;
  if (text.includes("job")) return Briefcase;
  if (text.includes("SSS")) return CreditCard;
  return Search;
};

export function SuggestionButton({
  text,
  onClick,
  className,
}: SuggestionButtonProps) {
  const Icon = getIconForText(text);

  return (
    <button
      className={cn(
        "group relative flex flex-col items-start justify-between gap-3 rounded-2xl border-2 border-gray-200 bg-white p-8 text-left text-sm text-gray-700 transition-all duration-300 hover:border-transparent hover:shadow-2xl hover:shadow-adult-green/30 min-h-[120px] overflow-hidden",
        className,
      )}
      onClick={onClick}
    >
      {/* Animated border overlay */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 rounded-2xl border-2 border-adult-green animate-pulse"></div>
        <div className="absolute inset-0 rounded-2xl border-2 border-adult-green/50 animate-ping"></div>
      </div>

      {/* Animated corner accents */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-adult-green rounded-tl-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 delay-100"></div>
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-adult-green rounded-tr-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 delay-200"></div>
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-adult-green rounded-bl-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 delay-300"></div>
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-adult-green rounded-br-2xl opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-500 delay-400"></div>

      {/* Content with relative positioning */}
      <span className="relative font-medium leading-snug z-10">{text}</span>
      <Icon className="relative h-5 w-5 text-gray-400 mt-auto z-10" />
    </button>
  );
}
