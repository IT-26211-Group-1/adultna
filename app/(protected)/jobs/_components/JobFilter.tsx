"use client";

import { useState, useCallback, ChangeEvent } from "react";

interface JobFiltersProps {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  defaultValue?: string;
}

export default function JobFilters({
  onSearch,
  isLoading = false,
  defaultValue = "",
}: JobFiltersProps) {
  const [inputValue, setInputValue] = useState(defaultValue);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setInputValue(value);
      onSearch(value);
    },
    [onSearch],
  );

  const handleClearSearch = useCallback(() => {
    setInputValue(defaultValue);
    onSearch(defaultValue);
  }, [onSearch, defaultValue]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          aria-label="Search jobs"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
          disabled={isLoading}
          placeholder="Search jobs by title, company, or skills..."
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />

        {inputValue && (
          <button
            aria-label="Clear search"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
            onClick={handleClearSearch}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M6 18L18 6M6 6l12 12"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          </button>
        )}

        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600" />
          </div>
        )}
      </div>
    </div>
  );
}
