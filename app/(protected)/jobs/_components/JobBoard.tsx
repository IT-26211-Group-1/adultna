"use client";

import { useState, useCallback, useMemo, useRef } from "react";
import JobList from "./JobList";
import JobFilters from "./JobFilter";
import { useJobSearch } from "@/hooks/queries/useJobQueries";

const DEBOUNCE_DELAY = 400;
const DEFAULT_SEARCH_QUERY = "Software Engineer in Philippines";

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState<string>(DEFAULT_SEARCH_QUERY);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Fetch jobs
  const { data: jobs = [], isLoading, error } = useJobSearch(searchQuery);

  const handleSearch = useCallback((inputValue: string) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Set new timer for debounced search
    debounceTimerRef.current = setTimeout(() => {
      setSearchQuery(inputValue.trim());
    }, DEBOUNCE_DELAY);
  }, []);

  const displayJobs = useMemo(() => jobs, [jobs]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">
          Error:{" "}
          {error instanceof Error ? error.message : "Failed to fetch jobs"}
        </p>
        <button
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          onClick={() => setSearchQuery("")}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <JobFilters
        isLoading={isLoading}
        onSearch={handleSearch}
        defaultValue={DEFAULT_SEARCH_QUERY}
      />
      {isLoading && jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : (
        <JobList jobs={displayJobs} />
      )}
      {!isLoading && displayJobs.length === 0 && searchQuery.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
