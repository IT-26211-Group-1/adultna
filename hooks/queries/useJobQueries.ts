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
  job_salary_min?: number;
  job_salary_max?: number;
  job_salary_currency?: string;
  job_salary_period?: string;
  job_is_remote?: boolean;
}

interface JSearchResponse {
  status: string;
  data: JSearchJob[];
}

interface JobSearchParams {
  query: string;
  country?: string;
  page?: number;
  numPages?: number;
  datePostedRelative?: string;
}

// API Functions
const jobsApi = {
  searchJobs: async (params: JobSearchParams): Promise<Job[]> => {
    const { query, page = 1, numPages = 1, datePostedRelative } = params;

    const searchParams = new URLSearchParams();

    // Use default query for recent jobs if no query provided, with Philippines filter
    const searchQuery = query || "jobs in Philippines";

    // Always include Philippines in the search
    const philippinesQuery = query
      ? `${query} Philippines OR remote`
      : searchQuery;

    searchParams.set("query", philippinesQuery);
    searchParams.set("page", page.toString());
    searchParams.set("num_pages", numPages.toString());

    // Add location filters for Philippines
    searchParams.set("country", "PH");
    searchParams.set("remote_jobs_only", "false"); // Include both remote and local

    // Add date filter for recent jobs
    if (datePostedRelative) {
      searchParams.set("date_posted_relative", datePostedRelative);
    } else if (!query) {
      // Default to recent jobs when no search query
      searchParams.set("date_posted_relative", "week");
    }

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
      salaryMin: job.job_salary_min,
      salaryMax: job.job_salary_max,
      salaryCurrency: job.job_salary_currency,
      salaryPeriod: job.job_salary_period,
      isRemote: job.job_is_remote,
    }));
  },
};

// Query Hooks
export function useJobSearch(searchQuery: string, apiPage = 1) {
  return useQuery({
    queryKey: queryKeys.jobs.search(`${searchQuery}-page-${apiPage}`),
    queryFn: () =>
      jobsApi.searchJobs({
        query: searchQuery,
        page: apiPage,
        numPages: 5,
        datePostedRelative: !searchQuery ? "week" : undefined,
      }),
    enabled: true,
    staleTime: 30 * 60 * 1000,
    gcTime: 60 * 60 * 1000,
    retry: 1,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    placeholderData: [],
  });
}
