"use client";

import { JobCardProps } from "@/types/job";
import { memo } from "react";

const JobCard = memo(({ job }: JobCardProps) => {
  const formattedDate = (() => {
    if (!job.listedDate) return "";
    const d = new Date(job.listedDate);

    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  })();

  const relative = (() => {
    if (!job.listedDate) return "";
    const now = Date.now();
    const t = Date.parse(job.listedDate);

    if (Number.isNaN(t)) return "";
    const diffMs = now - t;
    const day = 24 * 60 * 60 * 1000;
    const hour = 60 * 60 * 1000;

    if (diffMs < hour) return "Just now";
    if (diffMs < day) return `${Math.floor(diffMs / hour)}h ago`;

    return `${Math.floor(diffMs / day)}d ago`;
  })();
  const handleApplyClick = () => {};

  return (
    <article className="border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-white">
      <header className="mb-2">
        <h3 className="font-semibold text-lg text-gray-900 mb-1">
          {job.title}
        </h3>
        <p className="text-sm text-gray-600">
          {job.company} • {job.location} • {job.type}
        </p>
      </header>

      <p className="mt-2 text-gray-700 text-sm leading-relaxed line-clamp-3">
        {job.description}
      </p>

      <footer className="mt-4 flex items-center justify-between">
        <p className="text-xs text-gray-500" title={formattedDate || undefined}>
          {relative
            ? `Listed: ${relative}`
            : formattedDate
              ? `Listed: ${formattedDate}`
              : ""}
        </p>
        <a
          className="inline-flex items-center px-4 py-2 bg-green-700 hover:bg-green-800 text-white text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
          href={job.applyUrl}
          rel="noopener noreferrer"
          target="_blank"
          onClick={handleApplyClick}
        >
          View Listing
        </a>
      </footer>
    </article>
  );
});

JobCard.displayName = "JobCard";

export default JobCard;
