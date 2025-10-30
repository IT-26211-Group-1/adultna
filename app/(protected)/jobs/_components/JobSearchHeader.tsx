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
    <div className="text-center h-90 mb-12 bg-gradient-to-br from-[#CBCBE7]/30 via-white/50 to-[#6395EE]/20 mx-4 px-16 py-16 rounded-2xl border border-white/40 relative overflow-hidden backdrop-blur-sm shadow-lg shadow-[#CBCBE7]/15">

      {/* Subtle Circle Gradients */}
      <div className="absolute top-8 left-12 w-32 h-32 bg-gradient-to-r from-[#CBCBE7]/25 to-transparent rounded-full blur-xl"></div>
      <div className="absolute bottom-12 right-16 w-40 h-40 bg-gradient-to-l from-[#6395EE]/15 to-transparent rounded-full blur-2xl"></div>
      <div className="absolute top-1/2 left-1/3 w-24 h-24 bg-gradient-to-br from-[#C8A2C8]/20 to-transparent rounded-full blur-lg"></div>

      {/* Content */}
      <div className="relative z-10">
        <div className="mb-8">
        <h1 className="text-4xl font-bold text-[#595880] mb-4 flex items-center justify-center gap-3">
          Find Your <span className="italic">Dream</span> Job Here
        </h1>
        <p className="text-gray-600 text-md max-w-2xl mx-auto leading-relaxed">
          We're here to help you find meaningful work that fits your life, values, and aspirations. Take your time exploring opportunities that truly resonate with you.
        </p>
      </div>

      {/* Search Bar Container */}
      <div className="max-w-5xl mx-auto">
        <div className="bg-white h-14 rounded-full p-1 border border-gray-200 flex items-center gap-2">
          {/* Search Input */}
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

          {/* Inline Filter Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* Job Type Filter */}
          <div className="flex items-center px-3">
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

          {/* Filter Divider */}
          <div className="h-8 w-px bg-gray-200"></div>

          {/* Employment Type Filter */}
          <div className="flex items-center px-3">
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
            className="px-8 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-full font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="mt-4 text-center">
            <button
              className="text-gray-600 hover:text-gray-800 text-sm underline"
              onClick={handleClearSearch}
            >
              Clear search
            </button>
          </div>
        )}
      </div>
      </div>
    </div>
  );
}