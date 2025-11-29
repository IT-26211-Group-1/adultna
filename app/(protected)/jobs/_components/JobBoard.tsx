"use client";

import { useState, useCallback, useEffect } from "react";
import JobSearchHeader from "./JobSearchHeader";
import JobFiltersBar from "./JobFiltersBar";
import JobList from "./JobList";
import JobCardSkeleton from "./JobCardSkeleton";
import Pagination from "../../../../components/ui/Pagination";
import { useJobSearch } from "@/hooks/queries/useJobQueries";
import { useJobFiltering } from "../../../../hooks/useJobFiltering";
import { useJobPagination } from "../../../../hooks/useJobPagination";
import { JobFilterState } from "@/types/job";

const JOBS_PER_PAGE = 9;

export default function JobBoard() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [apiPage, setApiPage] = useState<number>(1);
  const [filters, setFilters] = useState<JobFilterState>({
    datePosted: "all",
    jobType: "all",
    employmentType: "all",
  });

  const {
    data: jobs = [],
    error,
    isFetching,
  } = useJobSearch(searchQuery, apiPage);

  const filteredJobs = useJobFiltering(jobs, filters);
  const { displayJobs, totalPages, shouldShowPagination } = useJobPagination(
    filteredJobs,
    currentPage,
  );

  useEffect(() => {
    if (
      currentPage === totalPages &&
      totalPages > 1 &&
      !isFetching &&
      filteredJobs.length > 0
    ) {
      setApiPage((prev) => prev + 1);
    }
  }, [currentPage, totalPages, isFetching, filteredJobs.length]);

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
    setApiPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFilterChange = useCallback((newFilters: JobFilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  }, []);

  return (
    <div className="space-y-6">
      <JobSearchHeader
        filters={filters}
        isLoading={isFetching}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
      />

      <JobFiltersBar
        filters={filters}
        searchQuery={searchQuery}
        onFilterChange={handleFilterChange}
      />

      {isFetching ? (
        <div
          aria-label="Loading jobs"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto min-h-[1200px]"
          style={{ contain: "layout style paint" }}
        >
          {[...Array(JOBS_PER_PAGE)].map((_, index) => (
            <JobCardSkeleton key={index} index={index} />
          ))}
        </div>
      ) : error ? (
        <div className="text-center py-12">
          <p className="text-red-500 text-lg mb-2">Failed to load jobs</p>
          <p className="text-gray-400 text-sm">Please try again later</p>
        </div>
      ) : displayJobs.length > 0 ? (
        <>
          <JobList jobs={displayJobs} />
          {shouldShowPagination && (
            <Pagination
              currentPage={currentPage}
              isLoading={false}
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
