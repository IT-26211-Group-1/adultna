"use client";

import { useState, useCallback, useRef } from "react";

const DEBOUNCE_DELAY = 400; // not used currently afaik
const DEFAULT_SEARCH_QUERY = "";

type JobSearchHeaderProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
};

export default function JobSearchHeader({ onSearch, isLoading = false }: JobSearchHeaderProps) {
  const [inputValue, setInputValue] = useState<string>(DEFAULT_SEARCH_QUERY);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handleInputChange = useCallback((value: string) => {
    setInputValue(value);
  }, []);

  const handleSearch = useCallback(() => {
    onSearch(inputValue.trim());
  }, [inputValue, onSearch]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  }, [handleSearch]);

  const handleClearSearch = useCallback(() => {
    setInputValue("");
    onSearch("");
  }, [onSearch]);

  return (
    <div className="text-center mb-12 bg-gradient-to-br from-[#ACBD6F]/30 via-[#ACBD6F]/10 to-[#ACBD6F]/20 mx-8 px-12 py-16 rounded-2xl border border-[#ACBD6F]/20 relative overflow-hidden">
 
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#ACBD6F] mb-2 flex items-center justify-center gap-3">
          Find Your <span className="italic">Dream</span> Job Here
        </h1>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-2xl mx-auto">
        <div className="bg-white h-14 rounded-full p-1 border border-gray-200 flex items-center gap-2">

          {/* Job Title Input */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 px-6 py-3">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                aria-label="Search jobs"
                className="w-full text-gray-700 placeholder-gray-400 focus:outline-none text-sm"
                disabled={isLoading}
                placeholder="Search jobs by title, company, or skills..."
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
              />
            </div>
          </div>

          {/* Search Button */}
          <button
            aria-label="Search jobs"
            className="px-8 py-3 bg-[#ACBD6F] hover:bg-[#ACBD6F]/90 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
            onClick={handleSearch}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mx-auto" />
            ) : (
              "Search"
            )}
          </button>
        </div>

        {/* Clear Button */}
        {inputValue && (
          <button
            className="mt-4 text-gray-600 hover:text-gray-800 text-sm underline"
            onClick={handleClearSearch}
          >
            Clear search
          </button>
        )}
      </div>
    </div>
  );
}