"use client";

import { useState, useCallback } from "react";
import JobSearchHeader from "./JobSearchHeader";
import JobFiltersBar from "./JobFiltersBar";
import JobList from "./JobList";
import JobCardSkeleton from "./JobCardSkeleton";
import Pagination from "./Pagination";
import { useJobSearch } from "@/hooks/queries/useJobQueries";
import { useJobFiltering } from "./useJobFiltering";
import { useJobPagination } from "./useJobPagination";
import { JobFilterState } from "@/types/job";

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filters, setFilters] = useState<JobFilterState>({
    datePosted: "all",
    jobType: "all",
    employmentType: "all",
  });

  const {
    data: jobs = [],
    isLoading,
    error,
  } = useJobSearch(searchQuery);

  // Hooks for filtering and pagination
  const filteredJobs = useJobFiltering(jobs, filters);
  const { displayJobs, totalPages, shouldShowPagination, JOBS_PER_PAGE } = useJobPagination(filteredJobs, currentPage);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback((newFilters: JobFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); 
  }, []);

  if (error) {
    return (
      <div className="space-y-6">
        <JobSearchHeader
          onSearch={handleSearch}
          isLoading={true}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        <JobFiltersBar
          searchQuery={searchQuery}
          filters={filters}
          onFilterChange={handleFilterChange}
        />

        {/* Loading skeleton when error occurs */}
        <div aria-label="Loading jobs" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(JOBS_PER_PAGE)].map((_, index) => (
            <JobCardSkeleton key={index} index={index} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <JobSearchHeader
        onSearch={handleSearch}
        isLoading={isLoading}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      <JobFiltersBar
        searchQuery={searchQuery}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Jobs Display */}
      {isLoading && jobs.length === 0 ? (
        <div aria-label="Loading jobs" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {[...Array(JOBS_PER_PAGE)].map((_, index) => (
            <JobCardSkeleton key={index} index={index} />
          ))}
        </div>
      ) : displayJobs.length > 0 ? (
        <>
          <JobList jobs={displayJobs} />
          {shouldShowPagination && (
            <Pagination
              currentPage={currentPage}
              isLoading={isLoading}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg mb-2">
            {searchQuery ? "No jobs found" : "No recent jobs available"}
          </p>
          <p className="text-gray-400 text-sm">
            {searchQuery
              ? "Try adjusting your search terms or browse recent postings"
              : "Check back later for new opportunities"}
          </p>
        </div>
      )}
    </div>
  );
}
