"use client";

import { GuideCategory } from "@/types/govguide";

type GuideSearchProps = {
  searchValue: string;
  onSearchChange: (value: string) => void;
  selectedCategory: GuideCategory | "all";
  onCategoryChange: (category: GuideCategory | "all") => void;
};

const CATEGORY_LABELS: Record<GuideCategory | "all", string> = {
  all: "All Categories",
  identification: "Government IDs",
  "civil-registration": "Civil Registration",
  "permits-licenses": "Permits & Licenses",
  "social-services": "Social Services",
  "tax-related": "Tax-Related",
  legal: "Legal Documents",
  other: "Other",
};

export default function GuideSearch({
  searchValue,
  onSearchChange,
  selectedCategory,
  onCategoryChange
}: GuideSearchProps) {
  const handleClearSearch = () => {
    onSearchChange("");
    onCategoryChange("all");
  };

  return (
    <div className="mb-8">
      {/* Search Bar Container */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 px-4 py-2">
              <svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
              <input
                aria-label="Search government processes"
                className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                placeholder="Search government processes, requirements, or agencies..."
                type="text"
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
              />
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200" />

          {/* Category Filter */}
          <div className="flex items-center px-4 min-w-[180px]">
            <select
              className="border-none bg-transparent text-sm focus:outline-none text-gray-600 w-full"
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value as GuideCategory | "all")}
            >
              {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          {/* Search Button */}
          <button
            aria-label="Search guides"
            className="px-6 py-2 bg-adult-green hover:bg-green-600 text-white rounded-xl font-medium flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        </div>

        {/* Clear Button */}
        {(searchValue || selectedCategory !== "all") && (
          <div className="mt-3 px-4">
            <button
              className="text-gray-500 hover:text-gray-700 text-xs"
              onClick={handleClearSearch}
            >
              Clear search and filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
