"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import type { GovGuide, GuideStatus } from "@/types/govguide";
import { formatDate } from "@/constants/format-date";
import EditGuideModal from "./EditGuideModal";
import PreviewGuideModal from "./PreviewGuideModal";
import { useGuidesQueries } from "@/hooks/queries/admin/useGuidesQueries";
import { addToast } from "@heroui/react";

// Guide Status Badge Component

const GuideStatusBadge = React.memo<{ status: GuideStatus }>(({ status }) => {
  const variants = {
    pending: "warning",
    accepted: "success",
    rejected: "error",
    to_revise: "info",
  } as const;

  const labels = {
    pending: "Pending",
    accepted: "Accepted",
    rejected: "Rejected",
    to_revise: "To Revise",
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
  onRestore: (guideId: string) => void;
  onPermanentDelete: (guideId: string) => void;
  isDeleting: boolean;
  isRestoring: boolean;
  isPermanentDeleting: boolean;
  isDeletingThisGuide: boolean;
  isRestoringThisGuide: boolean;
  isPermanentDeletingThisGuide: boolean;
};

// Memoized actions dropdown
const GuideActions = React.memo<GuideActionsProps>(
  ({
    guide,
    onEdit,
    onPreview,
    onDelete,
    onRestore,
    onPermanentDelete,
    isDeleting,
    isRestoring,
    isPermanentDeleting,
    isDeletingThisGuide,
    isRestoringThisGuide,
    isPermanentDeletingThisGuide,
  }) => {
    if (isDeletingThisGuide || isPermanentDeletingThisGuide) {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-red-600"
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

    if (isRestoringThisGuide) {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-adult-green"
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

    const menuItems = [];
    const isArchived = !guide.isActive;

    // If archived, show restore and permanent delete options
    if (isArchived) {
      menuItems.push(
        {
          label: "Restore",
          onClick: () => onRestore(guide.id),
          disabled: isRestoring || isPermanentDeleting,
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          ),
        },
        {
          label: "Delete Permanently",
          onClick: () => onPermanentDelete(guide.id),
          disabled: isRestoring || isPermanentDeleting,
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
        }
      );
    } else {
      // Active guides
      menuItems.push(
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
          label: "Archive",
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
                d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
          ),
        }
      );
    }

    return (
      <DropdownMenu
        items={menuItems}
        trigger={
          <button
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            disabled={isDeleting || isRestoring || isPermanentDeleting}
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
  }
);

GuideActions.displayName = "GuideActions";

const GuidesTable: React.FC = () => {
  const [showArchived, setShowArchived] = useState(false);
  const [deletingGuideId, setDeletingGuideId] = useState<string | null>(null);
  const [restoringGuideId, setRestoringGuideId] = useState<string | null>(null);
  const [permanentDeletingGuideId, setPermanentDeletingGuideId] = useState<
    string | null
  >(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [selectedGuide, setSelectedGuide] = useState<GovGuide | null>(null);

  // Fetch guides from API
  const {
    useListGuides,
    softDeleteGuide,
    restoreGuide,
    hardDeleteGuide,
    isSoftDeletingGuide,
    isRestoringGuide,
    isHardDeletingGuide,
  } = useGuidesQueries();
  const { data, isLoading } = useListGuides();

  const guides: GovGuide[] = useMemo(() => {
    if (!data?.success || !data?.data?.guides) return [];

    // Map backend data to frontend format
    return data.data.guides.map((guide: any) => {
      // Parse JSON fields if they're strings
      const offices =
        typeof guide.offices === "string"
          ? JSON.parse(guide.offices)
          : guide.offices;
      const steps =
        typeof guide.steps === "string" ? JSON.parse(guide.steps) : guide.steps;
      const requirements =
        typeof guide.requirements === "string"
          ? JSON.parse(guide.requirements)
          : guide.requirements;

      return {
        id: guide.id,
        slug: guide.slug,
        title: guide.title,
        issuingAgency: offices?.issuingAgency || "",
        category: guide.category,
        customCategory: guide.customCategory || null,
        summary: guide.description,
        estimatedProcessingTime: guide.processingTime,
        feeAmount: offices?.feeAmount || null,
        feeCurrency: offices?.feeCurrency || "PHP",
        oneTimeFee: offices?.oneTimeFee || true,
        status: guide.status,
        isActive: !guide.deletedAt,
        stepsCount: Array.isArray(steps) ? steps.length : 0,
        requirementsCount: Array.isArray(requirements)
          ? requirements.length
          : 0,
        createdAt: guide.createdAt,
        updatedAt: guide.updatedAt,
        updatedBy: guide.updatedBy || guide.createdBy,
        updatedByEmail: guide.updatedByEmail || null,
        createdByEmail: guide.createdByEmail || null,
        offices: offices,
        steps: steps,
        requirements: requirements,
      };
    });
  }, [data]);

  const loading = isLoading;
  const isDeleting = isSoftDeletingGuide || deletingGuideId !== null;
  const isRestoring = isRestoringGuide || restoringGuideId !== null;
  const isPermanentDeleting =
    isHardDeletingGuide || permanentDeletingGuideId !== null;

  // Filter guides into active and archived
  const activeGuides = useMemo(
    () => guides.filter((g) => g.isActive),
    [guides]
  );
  const archivedGuides = useMemo(
    () => guides.filter((g) => !g.isActive),
    [guides]
  );

  // Determine which guides to display based on toggle
  const displayGuides = showArchived ? archivedGuides : activeGuides;

  const handleEditGuide = useCallback(
    (guideId: string) => {
      const guide = guides.find((g) => g.id === guideId);

      if (guide) {
        setSelectedGuide(guide);
        setEditModalOpen(true);
      }
    },
    [guides]
  );

  const handleGuideUpdated = useCallback(() => {
    // Guides will auto-refresh via TanStack Query invalidation
    setEditModalOpen(false);
    setSelectedGuide(null);
  }, []);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedGuide(null);
  }, []);

  const handlePreviewGuide = useCallback(
    (guideId: string) => {
      const guide = guides.find((g) => g.id === guideId);

      if (guide) {
        setSelectedGuide(guide);
        setPreviewModalOpen(true);
      }
    },
    [guides]
  );

  const handleClosePreviewModal = useCallback(() => {
    setPreviewModalOpen(false);
    setSelectedGuide(null);
  }, []);

  const handleDeleteGuide = useCallback(
    (guideId: string) => {
      if (!confirm("Are you sure you want to archive this guide?")) return;

      setDeletingGuideId(guideId);
      softDeleteGuide(guideId, {
        onSuccess: () => {
          setDeletingGuideId(null);
          addToast({
            title: "Guide archived successfully",
            color: "success",
          });
        },
        onError: () => {
          setDeletingGuideId(null);
          addToast({ title: "Failed to archive guide", color: "danger" });
        },
      });
    },
    [softDeleteGuide]
  );

  const handleRestoreGuide = useCallback(
    (guideId: string) => {
      if (!confirm("Are you sure you want to restore this guide?")) return;

      setRestoringGuideId(guideId);
      restoreGuide(guideId, {
        onSuccess: () => {
          setRestoringGuideId(null);
          addToast({
            title: "Guide restored successfully",
            color: "success",
          });
        },
        onError: () => {
          setRestoringGuideId(null);
          addToast({ title: "Failed to restore guide", color: "danger" });
        },
      });
    },
    [restoreGuide]
  );

  const handlePermanentDeleteGuide = useCallback(
    (guideId: string) => {
      if (
        !confirm(
          "Are you sure you want to PERMANENTLY delete this guide? This action cannot be undone."
        )
      )
        return;

      setPermanentDeletingGuideId(guideId);
      hardDeleteGuide(guideId, {
        onSuccess: () => {
          setPermanentDeletingGuideId(null);
          addToast({
            title: "Guide permanently deleted",
            color: "success",
          });
        },
        onError: () => {
          setPermanentDeletingGuideId(null);
          addToast({
            title: "Failed to permanently delete guide",
            color: "danger",
          });
        },
      });
    },
    [hardDeleteGuide]
  );

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
            <span className="text-gray-900">{formatDate(guide.updatedAt)}</span>
            {guide.updatedByEmail && (
              <span className="text-gray-500 text-xs">
                by {guide.updatedByEmail}
              </span>
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
            isRestoring={isRestoring}
            isPermanentDeleting={isPermanentDeleting}
            isDeletingThisGuide={deletingGuideId === guide.id}
            isRestoringThisGuide={restoringGuideId === guide.id}
            isPermanentDeletingThisGuide={permanentDeletingGuideId === guide.id}
            onDelete={handleDeleteGuide}
            onRestore={handleRestoreGuide}
            onPermanentDelete={handlePermanentDeleteGuide}
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
      handleRestoreGuide,
      handlePermanentDeleteGuide,
      isDeleting,
      isRestoring,
      isPermanentDeleting,
      deletingGuideId,
      restoringGuideId,
      permanentDeletingGuideId,
    ]
  );

  return (
    <>
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-2">
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              !showArchived
                ? "bg-adult-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setShowArchived(false)}
          >
            Active Guides ({activeGuides.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showArchived
                ? "bg-adult-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setShowArchived(true)}
          >
            Archived Guides ({archivedGuides.length})
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        data={displayGuides}
        emptyMessage={
          showArchived ? "No archived guides found" : "No data available."
        }
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

      {/* Preview Modal */}
      {selectedGuide && (
        <PreviewGuideModal
          guide={selectedGuide}
          open={previewModalOpen}
          onClose={handleClosePreviewModal}
        />
      )}
    </>
  );
};

export default React.memo(GuidesTable);
