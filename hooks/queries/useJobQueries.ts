"use client";

import { useQuery } from "@tanstack/react-query";
import { queryKeys } from "@/lib/apiClient";
import { Job } from "@/types/job";

const JSEARCH_API_URL = "https://jsearch.p.rapidapi.com/search";
const JSEARCH_API_HOST = "jsearch.p.rapidapi.com";

interface JSearchJob {
  job_id: string;
  job_title: string;
  employer_name: string;
  job_city?: string;
  job_state?: string;
  job_country: string;
  job_employment_type?: string;
  job_description?: string;
  job_posted_at_datetime_utc?: string;
  job_apply_link: string;
}

interface JSearchResponse {
  status: string;
  data: JSearchJob[];
}

interface JobSearchParams {
  query: string;
  country?: string;
}

// API Functions
const jobsApi = {
  searchJobs: async (params: JobSearchParams): Promise<Job[]> => {
    const { query } = params;

    const searchParams = new URLSearchParams();

    if (query) searchParams.set("query", query);
    searchParams.set("page", "1");
    searchParams.set("num_pages", "1");

    const url = `${JSEARCH_API_URL}?${searchParams.toString()}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "X-RapidAPI-Key":
          process.env.NEXT_PUBLIC_JSEARCH_KEY ||
          "e3ad7740eamsh68f00e9f492b646p1ea313jsnf1f822c386ee",
        "X-RapidAPI-Host": JSEARCH_API_HOST,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch jobs: ${response.statusText}`);
    }

    const data: JSearchResponse = await response.json();

    // Transform JSearch response to Job type
    return data.data.map((job) => ({
      id: job.job_id,
      title: job.job_title,
      company: job.employer_name,
      location: job.job_city
        ? `${job.job_city}${job.job_state ? `, ${job.job_state}` : ""}, ${job.job_country}`
        : job.job_country,
      type: job.job_employment_type || "Full-time",
      description: job.job_description || "No description available",
      listedDate: job.job_posted_at_datetime_utc || new Date().toISOString(),
      applyUrl: job.job_apply_link,
    }));
  },
};

// Query Hooks
export function useJobSearch(searchQuery: string) {
  return useQuery({
    queryKey: queryKeys.jobs.search(searchQuery),
    queryFn: () => jobsApi.searchJobs({ query: searchQuery }),
    enabled: searchQuery.trim().length > 0,
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
    retry: 2,
    refetchOnWindowFocus: false,
  });
}
