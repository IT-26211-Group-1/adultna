import { useMemo } from "react";
import { Job } from "@/types/job";
import { JobFilterState } from "@/types/job";

export function useJobFiltering(jobs: Job[], filters: JobFilterState) {
  return useMemo(() => {
    let filtered = [...jobs];

    // Apply date filter
    if (filters.datePosted !== "all") {
      const now = new Date();

      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.listedDate);
        const diffTime = now.getTime() - jobDate.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (filters.datePosted) {
          case "today":
            return diffDays <= 1;
          case "3days":
            return diffDays <= 3;
          case "week":
            return diffDays <= 7;
          case "month":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Apply job type filter (remote/onsite/hybrid)
    if (filters.jobType !== "all") {
      filtered = filtered.filter((job) => {
        switch (filters.jobType) {
          case "remote":
            return (
              job.isRemote || job.location?.toLowerCase().includes("remote")
            );
          case "onsite":
            return (
              !job.isRemote && !job.location?.toLowerCase().includes("remote")
            );
          case "hybrid":
            return job.location?.toLowerCase().includes("hybrid");
          default:
            return true;
        }
      });
    }

    // Apply employment type filter
    if (filters.employmentType !== "all") {
      filtered = filtered.filter((job) => {
        const jobType = job.type?.toLowerCase();
        const jobTitle = job.title?.toLowerCase();
        const filterType = filters.employmentType.toLowerCase();

        // Special handling for internship filter
        if (filterType === "internship") {
          return (
            jobType?.includes("internship") ||
            jobTitle?.includes("intern") ||
            jobTitle?.includes("internship")
          );
        }

        return jobType?.includes(filterType);
      });
    }

    // Sort by date (newest first)
    return filtered.sort((a, b) => {
      const dateA = new Date(a.listedDate);
      const dateB = new Date(b.listedDate);

      return dateB.getTime() - dateA.getTime();
    });
  }, [jobs, filters]);
}
