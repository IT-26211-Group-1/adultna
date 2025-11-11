"use client";

import React, { memo } from "react";
import { Modal } from "@/components/ui/Modal";
import Badge from "@/components/ui/Badge";
import type { GovGuide } from "@/types/govguide";
import { formatDate } from "@/constants/formatDate";

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

  const statusVariants = {
    review: "info",
    published: "success",
    archived: "warning",
  } as const;

  const statusLabels = {
    review: "Review",
    published: "Published",
    archived: "Archived",
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
                {guide.issuingAgency}
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
                {guide.feeAmount !== null && guide.feeAmount !== undefined
                  ? `PHP ${guide.feeAmount.toFixed(2)}`
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
            Steps ({guide.stepsCount})
          </h3>
          <div className="space-y-3">
            {/* TODO: Fetch actual steps from API */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 italic">
                Step details will be loaded from the API. Currently showing:{" "}
                {guide.stepsCount} step(s).
              </p>
              {/* Placeholder for demonstration */}
              {Array.from({ length: Math.min(guide.stepsCount, 3) }, (_, i) => (
                <div
                  key={i}
                  className="flex gap-3 items-start mt-3 p-3 bg-white rounded border"
                >
                  <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-700 font-medium">
                      Step {i + 1} placeholder
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Requirements ({guide.requirementsCount})
          </h3>
          <div className="space-y-3">
            {/* TODO: Fetch actual requirements from API */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-500 italic">
                Requirement details will be loaded from the API. Currently
                showing: {guide.requirementsCount} requirement(s).
              </p>
              {/* Placeholder for demonstration */}
              {Array.from(
                { length: Math.min(guide.requirementsCount, 3) },
                (_, i) => (
                  <div
                    key={i}
                    className="flex gap-3 items-start mt-3 p-3 bg-white rounded border"
                  >
                    <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0">
                      {i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-gray-700 font-medium">
                        Requirement {i + 1}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Description placeholder
                      </p>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
        </div>

        {/* Metadata Section */}
        <div className="border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Metadata
          </h3>
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
