"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { addToast } from "@heroui/toast";
import { useFeedback, Feedback, FeedbackStatus, FeedbackType } from "@/hooks/queries/admin/useFeedbackQueries";
import EditFeedbackModal from "./EditFeedbackModal";

// Memoized feedback type badge
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

// Memoized status badge
const FeedbackStatusBadge = React.memo<{ status: FeedbackStatus }>(({ status }) => (
  <Badge size="sm" variant={status === "resolved" ? "success" : "warning"}>
    {status ? status.charAt(0).toUpperCase() + status.slice(1) : "Unknown"}
  </Badge>
));

FeedbackStatusBadge.displayName = "FeedbackStatusBadge";

// Memoized feedback info
const FeedbackInfo = React.memo<{ feedback: Feedback }>(({ feedback }) => (
  <div className="space-y-1">
    <div className="font-medium text-gray-900">{feedback.title}</div>
    <div className="text-sm text-gray-500 truncate max-w-md">
      {feedback.description}
    </div>
    <div className="text-xs text-gray-400">Feature: {feedback.feature}</div>
  </div>
));

FeedbackInfo.displayName = "FeedbackInfo";

// Memoized submitter info
const SubmitterInfo = React.memo<{ feedback: Feedback }>(({ feedback }) => (
  <div className="text-gray-900">
    {feedback.submittedByEmail && feedback.submittedByEmail !== "No Email"
      ? feedback.submittedByEmail
      : "No Email"}
  </div>
));

SubmitterInfo.displayName = "SubmitterInfo";

// Memoized actions dropdown
const FeedbackActions = React.memo<{
  feedback: Feedback;
  onEdit: (feedbackId: string) => void;
  onToggleStatus: (feedbackId: string, currentStatus: FeedbackStatus) => void;
  isUpdating: boolean;
}>(({ feedback, onEdit, onToggleStatus, isUpdating }) => (
  <DropdownMenu
    items={[
      {
        label: "Edit Feedback",
        onClick: () => onEdit(feedback.id),
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
        label: feedback.status === "pending" ? "Mark as Resolved" : "Mark as Pending",
        onClick: () => onToggleStatus(feedback.id, feedback.status),
        disabled: isUpdating,
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
    ]}
    trigger={
      <button
        className="p-1 hover:bg-gray-100 rounded-full transition-colors"
        disabled={isUpdating}
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
));

FeedbackActions.displayName = "FeedbackActions";

const FeedbackTable: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const {
    feedback,
    feedbackCount,
    isLoadingFeedback: loading,
    feedbackError,
    updateFeedbackStatus,
    isUpdatingStatus,
    refetchFeedback,
  } = useFeedback();

  // Memoized date formatter
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
      const newStatus: FeedbackStatus = currentStatus === "pending" ? "resolved" : "pending";
      const action = newStatus === "resolved" ? "resolve" : "reopen";

      if (confirm(`Are you sure you want to ${action} this feedback?`)) {
        updateFeedbackStatus(
          { feedbackId, status: newStatus },
          {
            onSuccess: (response) => {
              if (response.success) {
                const actionPast = newStatus === "resolved" ? "resolved" : "reopened";
                addToast({
                  title: response.message || `Feedback ${actionPast} successfully`,
                  color: "success",
                  timeout: 4000,
                });
              }
            },
            onError: (error: any) => {
              addToast({
                title: error?.message || "Failed to update feedback status",
                color: "danger",
                timeout: 4000,
              });
            },
          },
        );
      }
    },
    [updateFeedbackStatus],
  );

  // Memoized table columns
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
          <div className="text-gray-600 text-sm truncate max-w-xs" title={feedback.description}>
            {feedback.description}
          </div>
        ),
        width: "300px",
      },
      {
        header: "Status",
        accessor: (feedback) => <FeedbackStatusBadge status={feedback.status} />,
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
            onEdit={handleEditFeedback}
            onToggleStatus={handleToggleStatus}
            isUpdating={isUpdatingStatus}
          />
        ),
        width: "80px",
        align: "center" as const,
      },
    ],
    [formatDate, handleEditFeedback, handleToggleStatus, isUpdatingStatus],
  );

  // Error state
  if (feedbackError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Failed to load feedback. Please try again.</p>
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
          <h2 className="text-lg font-semibold text-gray-900">Feedback Management</h2>
          <p className="text-sm text-gray-600">
            Manage user feedback and feature requests
          </p>
        </div>
        <div className="text-sm text-gray-500">
          {loading ? "Loading..." : `${feedbackCount} feedback items`}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border">
        <div className="max-h-96 overflow-auto">
          <Table
            columns={columns}
            data={feedback.filter(item => item && item.id)} // Filter out invalid items
            emptyMessage="No feedback found"
            loading={loading}
          />
        </div>
      </div>

      {selectedFeedback && (
        <EditFeedbackModal
          open={editModalOpen}
          feedback={selectedFeedback}
          onClose={handleCloseEditModal}
          onFeedbackUpdated={handleFeedbackUpdated}
        />
      )}
    </div>
  );
};

export default React.memo(FeedbackTable);
