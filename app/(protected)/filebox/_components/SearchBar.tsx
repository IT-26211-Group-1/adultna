"use client";

import { Search } from "./Search";
import { Categories } from "./Categories";
import { Button } from "@heroui/button";
import { Archive } from "lucide-react";

type SearchBarProps = {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUploadClick: () => void;
  onArchivedClick: () => void;
};

export function SearchBar({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onUploadClick,
  onArchivedClick,
}: SearchBarProps) {
  return (
    <div className="mb-6">
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
        <div className="flex items-center gap-3">
          <Categories
            className="w-56"
            includeAllCategories={true}
            selectedCategory={selectedCategory}
            onSelectionChange={onCategoryChange}
          />

          <Button
            className="text-gray-700 hover:bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            startContent={<Archive className="w-4 h-4" />}
            variant="bordered"
            onPress={onArchivedClick}
          >
            Archived
          </Button>

          <Button
            className="bg-[#11553F] text-white hover:bg-[#0e4634] px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            onPress={onUploadClick}
          >
            + Upload
          </Button>
        </div>
      </div>
    </div>
  );
}
