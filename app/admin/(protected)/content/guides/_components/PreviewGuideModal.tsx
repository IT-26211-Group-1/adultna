"use client";

import React, { memo, useMemo } from "react";
import { Modal } from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { GovGuide } from "@/types/govguide";
import { formatDate } from "@/constants/format-date";
import type { ProcessStep, DocumentRequirement, OfficeInfo } from "@/hooks/queries/admin/useGuidesQueries";

interface PreviewGuideModalProps {
  open?: boolean;
  onClose?: () => void;
  guide: GovGuide | null;
}

function PreviewGuideModal({
  open = false,
  onClose = () => {},
  guide,
}: PreviewGuideModalProps) {
  if (!guide) return null;

  // Parse JSON fields
  const offices: OfficeInfo | null = useMemo(() => {
    if (!guide.offices) return null;
    try {
      return typeof guide.offices === "string"
        ? JSON.parse(guide.offices)
        : guide.offices;
    } catch (error) {
      console.error("Error parsing offices:", error);
      return null;
    }
  }, [guide.offices]);

  const steps: ProcessStep[] = useMemo(() => {
    if (!guide.steps) return [];
    try {
      return typeof guide.steps === "string"
        ? JSON.parse(guide.steps)
        : guide.steps;
    } catch (error) {
      console.error("Error parsing steps:", error);
      return [];
    }
  }, [guide.steps]);

  const requirements: DocumentRequirement[] = useMemo(() => {
    if (!guide.requirements) return [];
    try {
      return typeof guide.requirements === "string"
        ? JSON.parse(guide.requirements)
        : guide.requirements;
    } catch (error) {
      console.error("Error parsing requirements:", error);
      return [];
    }
  }, [guide.requirements]);

  const statusVariants = {
    pending: "warning",
    accepted: "success",
    rejected: "error",
    to_revise: "info",
  } as const;

  const statusLabels = {
    pending: "Pending Review",
    accepted: "Accepted",
    rejected: "Rejected",
    to_revise: "To Revise",
  };

  return (
    <Modal open={open} title="Guide Preview" onClose={onClose}>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {guide.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Slug: <span className="font-mono">{guide.slug}</span>
              </p>
            </div>
            <Badge size="md" variant={statusVariants[guide.status]}>
              {statusLabels[guide.status]}
            </Badge>
          </div>

          {guide.summary && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700">{guide.summary}</p>
            </div>
          )}
        </div>

        {/* Basic Information */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Basic Information
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Issuing Agency
              </label>
              <p className="mt-1 text-gray-900 font-medium">
                {offices?.issuingAgency || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Estimated Processing Time
              </label>
              <p className="mt-1 text-gray-900">
                {guide.estimatedProcessingTime || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Fee Amount
              </label>
              <p className="mt-1 text-gray-900">
                {offices?.feeAmount !== null && offices?.feeAmount !== undefined
                  ? `${offices.feeCurrency || "PHP"} ${offices.feeAmount.toFixed(2)}`
                  : "Free"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500">
                Active Status
              </label>
              <p className="mt-1">
                <Badge
                  size="sm"
                  variant={guide.isActive ? "success" : "default"}
                >
                  {guide.isActive ? "Active" : "Inactive"}
                </Badge>
              </p>
            </div>
          </div>
        </div>

        {/* Steps Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Steps ({steps.length})
          </h3>
          <div className="space-y-3">
            {steps.length > 0 ? (
              steps.map((step, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0">
                    {step.stepNumber}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium mb-1">
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-sm text-gray-600 mb-2">
                        {step.description}
                      </p>
                    )}
                    {step.estimatedTime && (
                      <p className="text-xs text-gray-500">
                        Estimated time: {step.estimatedTime}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 italic">
                  No steps available for this guide.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Requirements ({requirements.length})
          </h3>
          <div className="space-y-3">
            {requirements.length > 0 ? (
              requirements.map((requirement, index) => (
                <div
                  key={index}
                  className="flex gap-3 items-start p-4 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-gray-900 font-medium">
                        {requirement.name}
                      </p>
                      {requirement.isRequired !== undefined && (
                        <Badge
                          size="sm"
                          variant={requirement.isRequired ? "error" : "default"}
                        >
                          {requirement.isRequired ? "Required" : "Optional"}
                        </Badge>
                      )}
                    </div>
                    {requirement.description && (
                      <p className="text-sm text-gray-600">
                        {requirement.description}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 italic">
                  No requirements available for this guide.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Metadata Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Metadata</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <label className="block text-gray-500">Created</label>
              <p className="mt-1 text-gray-900">
                {formatDate(guide.createdAt)}
              </p>
            </div>
            <div>
              <label className="block text-gray-500">Last Updated</label>
              <p className="mt-1 text-gray-900">
                {formatDate(guide.updatedAt)}
              </p>
            </div>
            <div className="col-span-2">
              <label className="block text-gray-500">Last Updated By</label>
              <p className="mt-1 text-gray-900">{guide.updatedBy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end pt-4 border-t mt-6">
        <button
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          type="button"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </Modal>
  );
}

export default memo(PreviewGuideModal);
