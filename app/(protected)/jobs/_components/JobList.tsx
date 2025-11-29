"use client";

import { memo } from "react";
import JobCard from "./JobCard";
import { Job } from "@/types/job";

interface JobListProps {
  jobs: Job[];
}

const JobList = memo(({ jobs }: JobListProps) => {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-4">
          <svg
            className="mx-auto h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M8 6a2 2 0 00-2 2v6.002"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
            />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No jobs found
        </h3>
        <p className="text-gray-500">Try adjusting your search criteria.</p>
      </div>
    );
  }

  return (
    <div
      aria-label="Job listings"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto min-h-[1200px]"
      role="list"
      style={{ contain: "layout style paint" }}
    >
      {jobs.map((job, index) => (
        <div key={`${job.id}-${index}`} role="listitem">
          <JobCard index={index} job={job} />
        </div>
      ))}
    </div>
  );
});

JobList.displayName = "JobList";

export default JobList;
