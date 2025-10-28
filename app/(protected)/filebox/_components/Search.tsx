"use client";
import { Input } from "@heroui/react";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
  searchTerm: string;
  onSearchChange: (searchTerm: string) => void;
}

export function Search({ searchTerm, onSearchChange }: SearchProps) {
  return (
    <Input
      className="w-full"
      classNames={{
        input: "text-gray-700 font-medium",
      }}
      placeholder="Search documents"
      startContent={<SearchIcon className="w-4 h-4 text-gray-400" />}
      value={searchTerm}
      onValueChange={onSearchChange}
    />
  );
}
