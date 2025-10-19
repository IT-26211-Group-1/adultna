import { useMemo } from "react";
import { Job } from "@/types/job";

const JOBS_PER_PAGE = 9;

export function useJobPagination(filteredJobs: Job[], currentPage: number) {
  const totalPages = Math.max(Math.ceil(filteredJobs.length / JOBS_PER_PAGE), 1);

  const displayJobs = useMemo(() => {
    const startIndex = (currentPage - 1) * JOBS_PER_PAGE;
    const endIndex = startIndex + JOBS_PER_PAGE;
    return filteredJobs.slice(startIndex, endIndex);
  }, [filteredJobs, currentPage]);

  const shouldShowPagination = filteredJobs.length > JOBS_PER_PAGE;

  return {
    displayJobs,
    totalPages,
    shouldShowPagination,
    JOBS_PER_PAGE
  };
}