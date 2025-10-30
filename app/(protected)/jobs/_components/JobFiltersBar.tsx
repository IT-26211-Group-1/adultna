"use client";

import { JobFilterState } from "@/types/job";

type JobFiltersBarProps = {
  searchQuery: string;
  filters: JobFilterState;
  onFilterChange: (filters: JobFilterState) => void;
};

export default function JobFiltersBar({ searchQuery, filters, onFilterChange }: JobFiltersBarProps) {
  return (
    <div className="max-w-6xl mx-auto mb-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-900">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Recent Job Postings"}
        </h2>

        {/* Date Posted Filter */}
        <div className="bg-white border border-gray-300 rounded-full px-4 py-2">
          <select
            className="border-none bg-transparent text-sm focus:outline-none"
            value={filters.datePosted}
            onChange={(e) => onFilterChange({...filters, datePosted: e.target.value})}
          >
            <option value="all">All time</option>
            <option value="today">Today</option>
            <option value="3days">Last 3 days</option>
            <option value="week">This week</option>
            <option value="month">This month</option>
          </select>
        </div>
      </div>
    </div>
  );
}