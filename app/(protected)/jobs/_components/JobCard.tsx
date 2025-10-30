"use client";

import { JobCardProps } from "@/types/job";
import { memo, useCallback } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { LoadingButton } from "@/components/ui/Button";
import { ExternalLink, AlertTriangle } from "lucide-react";

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

  const cardColors = [
    'from-[#ACBD6F]/20 to-[#ACBD6F]/5', // Olivine
    'from-[#F16F33]/20 to-[#F16F33]/5', // Crayola Orange
    'from-[#FCE2A9]/30 to-[#FCE2A9]/10', // Peach Yellow
    'from-[#CBCBE7]/25 to-[#CBCBE7]/8', // Periwinkle
  ];

  const cardColor = cardColors[(index || 0) % cardColors.length];


  const handleApplyClick = useCallback(() => {
    onOpen();
  }, [onOpen]);

  const handleConfirmRedirect = useCallback(() => {
    window.open(job.applyUrl, "_blank", "noopener,noreferrer");
    onClose();
  }, [job.applyUrl, onClose]);


  return (
    <>
      <div className={`bg-gradient-to-br ${cardColor} border border-gray-200 rounded-2xl overflow-hidden transition-all duration-300 h-full flex flex-col`}>
       
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
              const daysAgo = job.listedDate ? Math.floor((Date.now() - Date.parse(job.listedDate)) / (1000 * 60 * 60 * 24)) : 0;
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

      {/* External Redirect Confirmation Modal */}
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        placement="center"
        size="lg"
        onClose={onClose}
        classNames={{
          backdrop: "backdrop-blur-md bg-black/30 z-[9999] fixed inset-0",
          wrapper: "z-[10000]",
          base: "z-[10001]"
        }}
        portalContainer={typeof window !== 'undefined' ? document.body : undefined}
      >
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1 px-6 pt-6 pb-2">
            <h3 className="text-lg font-semibold text-[#11553F]">
              You are leaving AdultNa
            </h3>
            <p className="text-xs text-gray-600">
              This will redirect you to an external job listing.
            </p>
          </ModalHeader>
          <ModalBody className="px-6 py-2">
            <div className="space-y-6">
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-amber-800 font-medium text-sm">
                    You are being redirected to: {job.company}
                  </p>
                  <p className="text-amber-700 text-xs mt-1 break-all">
                    {job.applyUrl}
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-700 leading-relaxed italic">
                  <span className="font-medium text-[#11553F]">
                    Disclaimer:{" "}
                  </span>
                  Always verify job legitimacy and never share personal
                  information unless you&apos;re certain of the employer&apos;s
                  authenticity.
                </p>
              </div>
            </div>
          </ModalBody>
          <ModalFooter className="px-6 py-6 flex justify-end">
            <div className="flex items-center gap-4">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-transparent border-0"
                onClick={onClose}
              >
                Cancel
              </button>
              <LoadingButton
                className="flex items-center justify-center gap-2 px-6 py-3 h-auto text-sm font-medium bg-[#11553F] hover:bg-[#0d4532] text-white rounded-lg border-0"
                onClick={handleConfirmRedirect}
              >
                <span className="flex items-center gap-2">
                  Continue
                  <ExternalLink size={14} />
                </span>
              </LoadingButton>
            </div>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

JobCard.displayName = "JobCard";

export default JobCard;
