"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { addToast } from "@heroui/toast";
import {
  useFeedback,
  Feedback,
  FeedbackStatus,
  FeedbackType,
} from "@/hooks/queries/admin/useFeedbackQueries";
import EditFeedbackModal from "./EditFeedbackModal";
import { TableSkeleton } from "@/components/ui/Skeletons";

const FeedbackTypeBadge = React.memo<{ type: FeedbackType }>(({ type }) => {
  const getTypeColor = (type: FeedbackType) => {
    switch (type) {
      case "report":
        return "error";
      case "feedback":
        return "info";
      default:
        return "default";
    }
  };

  return (
    <Badge size="sm" variant={getTypeColor(type)}>
      {type ? type.charAt(0).toUpperCase() + type.slice(1) : "Unknown"}
    </Badge>
  );
});

FeedbackTypeBadge.displayName = "FeedbackTypeBadge";

const FeedbackStatusBadge = React.memo<{ status: FeedbackStatus }>(
  ({ status }) => (
    <Badge size="sm" variant={status === "resolved" ? "success" : "warning"}>
      {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
    </Badge>
  ),
);

FeedbackStatusBadge.displayName = "FeedbackStatusBadge";

const SubmitterInfo = React.memo<{ feedback: Feedback }>(({ feedback }) => (
  <div className="text-gray-900">
    {feedback.submittedByEmail && feedback.submittedByEmail !== "No Email"
      ? feedback.submittedByEmail
      : "No Email"}
  </div>
));

SubmitterInfo.displayName = "SubmitterInfo";

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
    feedbackCount,
    isLoadingFeedback: loading,
    feedbackError,
    updateFeedbackStatus,
    isUpdatingStatus,
    deleteFeedback,
    isDeletingFeedback,
    refetchFeedback,
  } = useFeedback();

  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

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
                console.error("Feedback update error:", error);
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
              console.error("Feedback delete error:", error);
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

  const columns: Column<Feedback>[] = useMemo(
    () => [
      {
        header: "Feature",
        accessor: (feedback) => (
          <div className="text-gray-900 font-medium">{feedback.feature}</div>
        ),
        width: "120px",
      },
      {
        header: "Title",
        accessor: (feedback) => (
          <div className="text-gray-900 font-medium">{feedback.title}</div>
        ),
        width: "200px",
      },
      {
        header: "Description",
        accessor: (feedback) => (
          <div
            className="text-gray-600 text-sm truncate max-w-xs"
            title={feedback.description}
          >
            {feedback.description}
          </div>
        ),
        width: "300px",
      },
      {
        header: "Status",
        accessor: (feedback) => (
          <FeedbackStatusBadge status={feedback.status} />
        ),
        width: "100px",
      },
      {
        header: "Submitted By",
        accessor: (feedback) => <SubmitterInfo feedback={feedback} />,
        width: "200px",
      },
      {
        header: "Date",
        accessor: (feedback) => (
          <div className="text-gray-900">{formatDate(feedback.createdAt)}</div>
        ),
        width: "140px",
      },
      {
        header: "Actions",
        accessor: (feedback) => (
          <FeedbackActions
            feedback={feedback}
            isDeleting={isDeletingFeedback}
            isUpdating={isUpdatingStatus}
            onDelete={handleDeleteFeedback}
            onEdit={handleEditFeedback}
            onToggleStatus={handleToggleStatus}
          />
        ),
        width: "80px",
        align: "center" as const,
      },
    ],
    [
      formatDate,
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
        <p className="text-red-600">
          Failed to load feedback. Please try again.
        </p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          onClick={() => refetchFeedback()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Feedback Management
          </h2>
          <p className="text-sm text-gray-600">
            Manage user feedback and feature requests
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : `${feedbackCount} feedback items`}
        </div>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : (
        <Table
          columns={columns}
          data={feedback.filter((item) => item?.id)}
          emptyMessage="No feedback found"
          pagination={{
            enabled: true,
            pageSize: 10,
            pageSizeOptions: [10, 25, 50, 100],
          }}
        />
      )}

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
