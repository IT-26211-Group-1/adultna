import { Categories } from "./Categories";
import { Search } from "./Search";
import { ViewType } from "./ViewType";
import { Button } from "@heroui/button";

interface SearchSectionProps {
  viewType: "grid" | "list";
  onViewTypeChange: (viewType: "grid" | "list") => void;
  onUploadClick: () => void;
  onCategoryChange: (category: string) => void;
  selectedCategory: string;
  onSearchChange: (searchTerm: string) => void;
  searchTerm: string;
}

export function SearchSection({
  viewType,
  onViewTypeChange,
  onUploadClick,
  onCategoryChange,
  selectedCategory,
  onSearchChange,
  searchTerm,
}: SearchSectionProps) {
  return (
    <div className="space-y-4 mb-6">
      {/* Top row: Search, Categories, Upload */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex-1">
          <Search searchTerm={searchTerm} onSearchChange={onSearchChange} />
        </div>
        <div className="flex flex-row gap-4 w-full md:w-auto">
          <Categories
            className="flex-1 md:w-48"
            includeAllCategories={true}
            selectedCategory={selectedCategory}
            onSelectionChange={onCategoryChange}
          />
          <Button
            className="bg-adult-green text-white hover:bg-adult-green/90 px-4 py-2 rounded-lg font-medium text-sm transition-colors whitespace-nowrap"
            onPress={onUploadClick}
          >
            + Upload
          </Button>
        </div>
      </div>

      {/* Bottom row: ViewType */}
      <div className="flex justify-start">
        <ViewType selectedView={viewType} onViewChange={onViewTypeChange} />
      </div>
    </div>
  );
}
