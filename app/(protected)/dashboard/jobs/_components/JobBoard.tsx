"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import JobList from "./JobList";
import JobFilters from "./JobFilter";
import { Job } from "@/types/job";

const DEBOUNCE_DELAY = 400;
const FETCH_CONFIG = {
  cache: "no-store" as RequestCache,
};

export default function JobBoard() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [query, setQuery] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    if (!query.trim()) return jobs;

    const searchTerm = query.toLowerCase().trim();

    return jobs.filter(
      (job) =>
        job.title.toLowerCase().includes(searchTerm) ||
        job.company.toLowerCase().includes(searchTerm) ||
        job.description.toLowerCase().includes(searchTerm) ||
        job.location.toLowerCase().includes(searchTerm)
    );
  }, [jobs, query]);

  const fetchJobs = useCallback(
    async (searchQuery: string, signal: AbortSignal) => {
      try {
        setIsLoading(true);
        setError(null);

        const params = new URLSearchParams();

        if (searchQuery) params.set("q", searchQuery);
        params.set("country", "ph");

        const queryString = params.toString();
        const url = `/api/jobs${queryString ? `?${queryString}` : ""}`;

        const response = await fetch(url, {
          signal,
          ...FETCH_CONFIG,
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch jobs: ${response.statusText}`);
        }

        const data: Job[] = await response.json();

        setJobs(data);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }

        console.error("Error fetching jobs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch jobs");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      fetchJobs(query, controller.signal);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [query, fetchJobs]);

  const handleSearch = useCallback((searchQuery: string) => {
    setQuery(searchQuery.trim());
  }, []);

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-md">
        <p className="text-red-600">Error: {error}</p>
        <button
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
          onClick={() => setQuery("")}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <JobFilters isLoading={isLoading} onSearch={handleSearch} />
      {isLoading && jobs.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : (
        <JobList jobs={filteredJobs} />
      )}
      {!isLoading && filteredJobs.length === 0 && jobs.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No jobs match your search criteria.</p>
        </div>
      )}
    </div>
  );
}
