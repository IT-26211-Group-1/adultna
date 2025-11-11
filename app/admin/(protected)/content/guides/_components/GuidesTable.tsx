"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import type { GovGuide, GuideStatus } from "@/types/govguide";
import { formatDate } from "@/constants/formatDate";
import EditGuideModal from "./EditGuideModal";

// Guide Status Badge Component
const GuideStatusBadge = React.memo<{ status: GuideStatus }>(({ status }) => {
  const variants = {
    review: "info",
    published: "success",
    archived: "warning",
  } as const;

  const labels = {
    review: "Review",
    published: "Published",
    archived: "Archived",
  };

  return (
    <Badge size="sm" variant={variants[status]}>
      {labels[status]}
    </Badge>
  );
});

GuideStatusBadge.displayName = "GuideStatusBadge";

type GuideActionsProps = {
  guide: GovGuide;
  onEdit: (guideId: string) => void;
  onPreview: (guideId: string) => void;
  onDelete: (guideId: string) => void;
  isDeleting: boolean;
  isDeletingThisGuide: boolean;
};

// Memoized actions dropdown
const GuideActions = React.memo<GuideActionsProps>(
  ({ guide, onEdit, onPreview, onDelete, isDeleting, isDeletingThisGuide }) => {
    if (isDeletingThisGuide) {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              fill="currentColor"
            />
          </svg>
        </div>
      );
    }

    const menuItems = [
      {
        label: "Edit Guide",
        onClick: () => onEdit(guide.id),
        disabled: isDeleting,
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        ),
      },
      {
        label: "Preview Guide",
        onClick: () => onPreview(guide.id),
        disabled: isDeleting,
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
            <path
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        ),
      },
      {
        label: "Delete Guide",
        onClick: () => onDelete(guide.id),
        disabled: isDeleting,
        destructive: true,
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        ),
      },
    ];

    return (
      <DropdownMenu
        items={menuItems}
        trigger={
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isDeleting}
          >
            <svg
              className="w-5 h-5 text-gray-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          </button>
        }
      />
    );
  },
);

GuideActions.displayName = "GuideActions";

const GuidesTable: React.FC = () => {
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GovGuide | null>(null);

  // Mock data - replace with actual API call
  const guides: GovGuide[] = useMemo(
    () => [
      {
        id: "1",
        slug: "philhealth-membership",
        title: "How to Apply for PhilHealth Membership",
        issuingAgency: "PhilHealth",
        category: "Benefit",
        summary: "Get PhilHealth coverage for medical expenses",
        estimatedProcessingTime: "2-3 weeks",
        feeAmount: 125.0,
        feeCurrency: "PHP",
        oneTimeFee: false,
        status: "published",
        isActive: true,
        stepsCount: 6,
        requirementsCount: 3,
        createdAt: "2024-01-15T08:00:00Z",
        updatedAt: "2024-01-15T08:00:00Z",
        updatedBy: "admin@adultna.com",
      },
      {
        id: "2",
        slug: "sss-membership",
        title: "SSS Membership Registration Process",
        issuingAgency: "SSS",
        category: "Benefit",
        summary: "Register for Social Security benefits",
        estimatedProcessingTime: "1-2 weeks",
        feeAmount: 0,
        feeCurrency: "PHP",
        oneTimeFee: true,
        status: "published",
        isActive: true,
        stepsCount: 4,
        requirementsCount: 2,
        createdAt: "2024-01-14T08:00:00Z",
        updatedAt: "2024-01-14T08:00:00Z",
        updatedBy: "content@adultna.com",
      },
      {
        id: "3",
        slug: "tin-application",
        title: "TIN Application for First-Time Taxpayers",
        issuingAgency: "BIR",
        category: "Tax Document",
        summary: "Get your Tax Identification Number",
        estimatedProcessingTime: "1 week",
        feeAmount: 0,
        feeCurrency: "PHP",
        oneTimeFee: true,
        status: "review",
        isActive: true,
        stepsCount: 5,
        requirementsCount: 4,
        createdAt: "2024-01-13T08:00:00Z",
        updatedAt: "2024-01-13T08:00:00Z",
        updatedBy: "admin@adultna.com",
      },
    ],
    [],
  );

  const loading = false;
  const isDeleting = deletingGuideId !== null;

  const handleEditGuide = useCallback(
    (guideId: string) => {
      const guide = guides.find((g) => g.id === guideId);

      if (guide) {
        setSelectedGuide(guide);
        setEditModalOpen(true);
      }
    },
    [guides],
  );

  const handleGuideUpdated = useCallback(() => {
    // TODO: Refetch guides from API
    setEditModalOpen(false);
    setSelectedGuide(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedGuide(null);
  }, []);

  const handlePreviewGuide = useCallback((guideId: string) => {
    console.log("Preview guide:", guideId);
    // TODO: Implement preview functionality
  }, []);

  const handleDeleteGuide = useCallback((guideId: string) => {
    if (!confirm("Are you sure you want to delete this guide?")) return;

    setDeletingGuideId(guideId);

    // Simulate API call
    setTimeout(() => {
      console.log("Delete guide:", guideId);
      setDeletingGuideId(null);
      // TODO: Implement actual delete and refetch
    }, 1000);
  }, []);

  const columns: Column<GovGuide>[] = useMemo(
    () => [
      {
        header: "Guide Title",
        accessor: (guide) => (
          <div className="flex items-start gap-2">
            <svg
              className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                clipRule="evenodd"
                d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                fillRule="evenodd"
              />
            </svg>
            <span className="font-medium text-gray-900 line-clamp-2">
              {guide.title}
            </span>
          </div>
        ),
        width: "300px",
      },
      {
        header: "Agency",
        accessor: (guide) => (
          <span className="font-medium text-gray-900">
            {guide.issuingAgency}
          </span>
        ),
        width: "120px",
      },
      {
        header: "Steps",
        accessor: (guide) => (
          <span className="text-gray-700">{guide.stepsCount} steps</span>
        ),
        width: "100px",
      },
      {
        header: "Status",
        accessor: (guide) => <GuideStatusBadge status={guide.status} />,
        width: "120px",
      },
      {
        header: "Last Updated",
        accessor: (guide) => (
          <div className="flex flex-col text-sm">
            <span className="text-gray-900">
              {formatDate(guide.updatedAt)}
            </span>
            {guide.updatedBy && (
              <span className="text-gray-500 text-xs">by {guide.updatedBy}</span>
            )}
          </div>
        ),
        width: "180px",
      },
      {
        header: "",
        accessor: (guide) => (
          <GuideActions
            guide={guide}
            isDeleting={isDeleting}
            isDeletingThisGuide={deletingGuideId === guide.id}
            onDelete={handleDeleteGuide}
            onEdit={handleEditGuide}
            onPreview={handlePreviewGuide}
          />
        ),
        width: "80px",
      },
    ],
    [
      formatDate,
      handleEditGuide,
      handlePreviewGuide,
      handleDeleteGuide,
      isDeleting,
      deletingGuideId,
    ],
  );

  return (
    <>
      <Table
        columns={columns}
        data={guides}
        emptyMessage="No guides found. Click 'Add Guide' to create your first guide."
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
      />

      {/* Edit Modal */}
      {selectedGuide && (
        <EditGuideModal
          guide={selectedGuide}
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onGuideUpdated={handleGuideUpdated}
        />
      )}
    </>
  );
};

export default React.memo(GuidesTable);
