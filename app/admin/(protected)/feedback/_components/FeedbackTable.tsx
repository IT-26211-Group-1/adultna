"use client";

import React, { useState, useMemo, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { AdminTable } from "@/components/admin/AdminTable";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { addToast } from "@heroui/toast";
import {
  useFeedback,
  Feedback,
  FeedbackStatus,
} from "@/hooks/queries/admin/useFeedbackQueries";
import EditFeedbackModal from "./EditFeedbackModal";
import { formatDate } from "@/constants/format-date";
import { logger } from "@/lib/logger";
import { AdminAddButton } from "@/components/admin/AdminAddButton";
import AddFeedbackModal from "./AddFeedbackModal";

const FeedbackActions = React.memo<{
  feedback: Feedback;
  onEdit: (feedbackId: string) => void;
  onToggleStatus: (feedbackId: string, currentStatus: FeedbackStatus) => void;
  onDelete: (feedbackId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
}>(
  ({
    feedback,
    onEdit: _onEdit,
    onToggleStatus,
    onDelete,
    isUpdating,
    isDeleting,
  }) => (
    <DropdownMenu
      items={[
        {
          label:
            feedback.status === "pending"
              ? "Mark as Resolved"
              : "Mark as Pending",
          onClick: () => onToggleStatus(feedback.id, feedback.status),
          disabled: isUpdating || isDeleting || feedback.status === "resolved",
          icon: (
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {feedback.status === "pending" ? (
                <path
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              ) : (
                <path
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              )}
            </svg>
          ),
        },
        {
          label: "Delete",
          onClick: () => onDelete(feedback.id),
          disabled: isUpdating || isDeleting,
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
      ]}
      trigger={
        <button
          className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          disabled={isUpdating || isDeleting}
        >
          <svg
            className="w-5 h-5 text-gray-400"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>
      }
    />
  ),
);

FeedbackActions.displayName = "FeedbackActions";

const FeedbackTable: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );

  const {
    feedback,
    isLoadingFeedback: loading,
    feedbackError,
    updateFeedbackStatus,
    isUpdatingStatus,
    deleteFeedback,
    isDeletingFeedback,
    refetchFeedback,
  } = useFeedback();

  const handleEditFeedback = useCallback(
    (feedbackId: string) => {
      const feedbackItem = feedback.find((f) => f.id === feedbackId);

      if (feedbackItem) {
        setSelectedFeedback(feedbackItem);
        setEditModalOpen(true);
      }
    },
    [feedback],
  );

  const handleFeedbackUpdated = useCallback(
    (_updatedFeedback?: Feedback) => {
      refetchFeedback();
      setEditModalOpen(false);
      setSelectedFeedback(null);
    },
    [refetchFeedback],
  );

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedFeedback(null);
  }, []);

  const handleToggleStatus = useCallback(
    (feedbackId: string, currentStatus: FeedbackStatus) => {
      // Validate feedbackId
      if (!feedbackId || typeof feedbackId !== "string") {
        addToast({
          title: "Invalid feedback ID",
          color: "danger",
          timeout: 4000,
        });

        return;
      }

      const newStatus: FeedbackStatus =
        currentStatus === "pending" ? "resolved" : "pending";
      const action = newStatus === "resolved" ? "resolve" : "reopen";

      if (confirm(`Are you sure you want to ${action} this feedback?`)) {
        const performUpdate = () => {
          updateFeedbackStatus(
            { feedbackId, status: newStatus },
            {
              onSuccess: (response) => {
                if (response.success) {
                  const actionPast =
                    newStatus === "resolved" ? "resolved" : "reopened";

                  addToast({
                    title:
                      response.message || `Feedback ${actionPast} successfully`,
                    color: "success",
                    timeout: 4000,
                  });
                }
              },
              onError: (error: any) => {
                logger.error("Feedback update error:", error);
                const isServerError = error?.response?.status >= 500;

                addToast({
                  title: isServerError
                    ? "Server error: The backend is experiencing issues. Please contact support if this persists."
                    : error?.message || "Failed to update feedback status",
                  color: "danger",
                  timeout: 8000,
                });
              },
            },
          );
        };

        performUpdate();
      }
    },
    [updateFeedbackStatus],
  );

  const handleDeleteFeedback = useCallback(
    (feedbackId: string) => {
      // Validate feedbackId
      if (!feedbackId || typeof feedbackId !== "string") {
        addToast({
          title: "Invalid feedback ID",
          color: "danger",
          timeout: 4000,
        });

        return;
      }

      if (
        confirm(
          "Are you sure you want to delete this feedback? This action cannot be undone.",
        )
      ) {
        deleteFeedback(
          { feedbackId },
          {
            onSuccess: (response) => {
              if (response.success) {
                addToast({
                  title: response.message || "Feedback deleted successfully",
                  color: "success",
                  timeout: 4000,
                });
              }
            },
            onError: (error: any) => {
              logger.error("Feedback delete error:", error);
              const isServerError = error?.response?.status >= 500;

              addToast({
                title: isServerError
                  ? "Server error: The backend is experiencing issues. Please contact support if this persists."
                  : error?.message || "Failed to delete feedback",
                color: "danger",
                timeout: 8000,
              });
            },
          },
        );
      }
    },
    [deleteFeedback],
  );

  // Sorted feedback list (by creation date, most recent first)
  const sortedFeedback = useMemo(
    () =>
      [...feedback].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        return dateB - dateA;
      }),
    [feedback],
  );

  // Table columns for @tanstack/react-table
  const columns: ColumnDef<Feedback>[] = useMemo(
    () => [
      {
        accessorKey: "feature",
        header: "Feature",
        cell: ({ row }) => (
          <div className="text-gray-900 font-medium whitespace-normal break-words">
            {row.getValue("feature")}
          </div>
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => (
          <div className="text-gray-900 font-medium whitespace-normal break-words">
            {row.getValue("title")}
          </div>
        ),
      },
      {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => (
          <div className="text-gray-600 text-sm whitespace-normal break-words max-w-md">
            {row.getValue("description")}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as FeedbackStatus;
          const colors = {
            resolved: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
          };

          return (
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status as keyof typeof colors]}`}
            >
              {status
                ? status.charAt(0).toUpperCase() + status.slice(1)
                : "Unknown"}
            </span>
          );
        },
      },
      {
        accessorKey: "submittedByEmail",
        header: "Submitted By",
        cell: ({ row }) => (
          <div className="text-gray-900">
            {row.getValue("submittedByEmail") &&
            row.getValue("submittedByEmail") !== "No Email"
              ? row.getValue("submittedByEmail")
              : "No Email"}
          </div>
        ),
      },
      {
        accessorKey: "createdAt",
        header: "Date",
        cell: ({ row }) => (
          <div className="text-gray-900 whitespace-normal">
            {formatDate(row.getValue("createdAt"))}
          </div>
        ),
      },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <FeedbackActions
            feedback={row.original}
            isDeleting={isDeletingFeedback}
            isUpdating={isUpdatingStatus}
            onDelete={handleDeleteFeedback}
            onEdit={handleEditFeedback}
            onToggleStatus={handleToggleStatus}
          />
        ),
      },
    ],
    [
      handleEditFeedback,
      handleToggleStatus,
      handleDeleteFeedback,
      isUpdatingStatus,
      isDeletingFeedback,
    ],
  );

  // Error state
  if (feedbackError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Failed to load feedback. Please try again.
        </p>
        <button
          className="px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90"
          onClick={() => refetchFeedback()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Feedback Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage user feedback and feature requests
          </p>
        </div>
        <AdminAddButton
          label="Add Feedback"
          modalComponent={<AddFeedbackModal />}
          variant="green"
        />
      </div>

      <AdminTable
        columns={columns}
        data={sortedFeedback}
        isLoading={loading}
        searchPlaceholder="Search feedback..."
      />

      {selectedFeedback && (
        <EditFeedbackModal
          feedback={selectedFeedback}
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onFeedbackUpdated={handleFeedbackUpdated}
        />
      )}
    </div>
  );
};

export default React.memo(FeedbackTable);
