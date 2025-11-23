"use client";

import { Search } from "./Search";
import { Categories } from "./Categories";
import { Button } from "@heroui/button";

type SearchBarProps = {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onUploadClick: () => void;
};

export function SearchBar({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
  onUploadClick,
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
