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
        "flex flex-col items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-6 text-left text-sm text-gray-700 transition-all hover:shadow-md hover:border-gray-300 min-h-[120px]",
        className,
      )}
      onClick={onClick}
    >
      <span className="font-medium leading-snug">{text}</span>
      <Icon className="h-5 w-5 text-gray-400 mt-auto" />
    </button>
  );
}
