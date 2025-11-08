"use client";

import { JobCardProps } from "@/types/job";
import { memo, useCallback, lazy, Suspense } from "react";
import { useDisclosure } from "@heroui/modal";
import { getJobCardColor } from "../../../../constants/job-card-color";

const ExternalRedirectModal = lazy(() => import("./ExternalRedirectModal"));

const JobCard = memo(({ job, index }: JobCardProps & { index?: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Clean up template variables in job data
  const cleanCompanyName = (company: string) => {
    if (!company) return "Company";
    // Remove template variables like {{data:job.brand_name}}
    const cleaned = company.replace(/\{\{.*?\}\}/g, "").trim();

    return cleaned || "Company";
  };

  const formattedDate = (() => {
    if (!job.listedDate) return "";
    const d = new Date(job.listedDate);

    if (Number.isNaN(d.getTime())) return "";

    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
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

  const cardColor = getJobCardColor(index || 0);

  const handleApplyClick = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleConfirmRedirect = useCallback(() => {
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    onClose();
  }, [job.applyUrl, onClose]);

  return (
    <>
      <div
        className={`bg-gradient-to-br ${cardColor} border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col`}
        style={{ contentVisibility: "auto" }}
      >
        {/* Header Section */}
        <div className="p-5 flex-grow">
          {/* Date or Job Posted */}
          <div className="mb-4">
            <div className="bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full inline-block">
              <span className="text-xs text-gray-700 font-medium">
                {relative || formattedDate || "Recent"}
              </span>
            </div>
          </div>

          {/* Company Name */}
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-700">
              {cleanCompanyName(job.company)}
            </p>
          </div>

          {/* Job Title */}
          <h3 className="font-bold text-xl text-gray-900 mb-4 leading-tight">
            {job.title}
          </h3>

          {/* Job Tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {/* Employment Type */}
            <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
              {job.type}
            </span>

            {/* Work Arrangement */}
            {job.isRemote ? (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                Remote
              </span>
            ) : job.location?.toLowerCase().includes("hybrid") ? (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                Hybrid
              </span>
            ) : (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                On-site
              </span>
            )}

            {/* Experience Level based on job title
            {(job.title.toLowerCase().includes("senior") || job.title.toLowerCase().includes("lead")) && (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                Senior Level
              </span>
            )}
            {(job.title.toLowerCase().includes("junior") || job.title.toLowerCase().includes("entry")) && (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                Junior Level
              </span>
            )}
            {job.title.toLowerCase().includes("intern") && (
              <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                Internship
              </span>
            )} */}

            {/* Urgent/Featured tags */}
            {(() => {
              const daysAgo = job.listedDate
                ? Math.floor(
                    (Date.now() - Date.parse(job.listedDate)) /
                      (1000 * 60 * 60 * 24)
                  )
                : 0;

              return daysAgo <= 1 ? (
                <span className="px-3 py-1 bg-white/60 backdrop-blur-sm text-gray-700 text-xs font-medium rounded-full border border-white/40">
                  New
                </span>
              ) : null;
            })()}
          </div>
        </div>

        {/* Footer Section of the Card */}
        <div className="bg-white p-4 flex items-center justify-between mt-auto border-t border-gray-100">
          <div className="text-sm text-gray-600">
            {job.location ? job.location.split(",")[0] : "Remote"}
          </div>
          <button
            className="bg-[#ACBD6F] hover:bg-[#A3B65D] text-white px-5 py-3 rounded-full text-sm font-medium transition-all duration-200 hover:shadow-lg"
            onClick={handleApplyClick}
          >
            View Listing
          </button>
        </div>
      </div>

      {isOpen && (
        <Suspense fallback={null}>
          <ExternalRedirectModal
            companyName={cleanCompanyName(job.company)}
            isOpen={isOpen}
            jobUrl={job.applyUrl}
            onClose={onClose}
            onConfirm={handleConfirmRedirect}
          />
        </Suspense>
      )}
    </>
  );
});

JobCard.displayName = "JobCard";

export default JobCard;
