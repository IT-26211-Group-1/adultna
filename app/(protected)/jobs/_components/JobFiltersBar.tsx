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
      <div className="flex items-center justify-between mb-4">

        {/* Left side - Dynamic Text (Search Queries keme) */}
        <h2 className="text-lg font-semibold text-gray-900">
          {searchQuery
            ? `Search results for "${searchQuery}"`
            : "Recent Job Postings"}
        </h2>

        {/* Right side - Filter Dropdowns */}

        <div className="flex gap-3">
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

          <div className="bg-white border border-gray-300 rounded-full px-4 py-2">
            <select
              className="border-none bg-transparent text-sm focus:outline-none"
              value={filters.jobType}
              onChange={(e) => onFilterChange({...filters, jobType: e.target.value})}
            >
              <option value="all">All types</option>
              <option value="remote">Remote</option>
              <option value="onsite">On-site</option>
              <option value="hybrid">Hybrid</option>
            </select>
          </div>

          <div className="bg-white border border-gray-300 rounded-full px-4 py-2">
            <select
              className="border-none bg-transparent text-sm focus:outline-none"
              value={filters.employmentType}
              onChange={(e) => onFilterChange({...filters, employmentType: e.target.value})}
            >
              <option value="all">All employment</option>
              <option value="full-time">Full-time</option>
              <option value="part-time">Part-time</option>
              <option value="contract">Contract</option>
              <option value="internship">Internship</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}