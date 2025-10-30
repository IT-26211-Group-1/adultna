"use client";

import { useState, useCallback } from "react";
import { JobFilterState } from "@/types/job";

const DEFAULT_SEARCH_QUERY = "";

type JobSearchHeaderProps = {
  onSearch: (query: string) => void;
  isLoading?: boolean;
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
};

export default function JobSearchHeader({ onSearch, isLoading = false, filters, onFilterChange }: JobSearchHeaderProps) {
  const [inputValue, setInputValue] = useState<string>(DEFAULT_SEARCH_QUERY);

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
    <div className="mb-8">
      {/* Search Bar Container */}
      <div className="max-w-6xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-sm p-2">
        <div className="flex items-center gap-2">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="flex items-center gap-3 px-4 py-3">
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

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* Location Filter */}
          <div className="flex items-center px-4">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <select
              className="border-none bg-transparent text-sm focus:outline-none text-gray-600 min-w-0"
              value={filters.jobType}
              onChange={(e) => onFilterChange({...filters, jobType: e.target.value})}
            >
              <option value="all">All Remote Options</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* Experience Filter */}
          <div className="flex items-center px-4">
            <svg className="w-4 h-4 text-gray-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <select
              className="border-none bg-transparent text-sm focus:outline-none text-gray-600 min-w-0"
              value={filters.employmentType}
              onChange={(e) => onFilterChange({...filters, employmentType: e.target.value})}
            >
              <option value="all">All Work Types</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>

          {/* Search Button */}
          <button
            aria-label="Search jobs"
            className="px-8 py-3 bg-[#ACBD6F] hover:bg-[#A3B65D] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            disabled={isLoading}
            onClick={handleSearch}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search
              </>
            )}
          </button>
        </div>

        {/* Clear Button */}
        {inputValue && (
          <div className="mt-3 px-4">
            <button
              className="text-gray-500 hover:text-gray-700 text-xs"
              onClick={handleClearSearch}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}