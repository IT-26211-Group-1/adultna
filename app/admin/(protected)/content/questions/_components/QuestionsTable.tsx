"use client";

import React, { useState, useMemo, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { AdminTable } from "@/components/admin/AdminTable";
import DropdownMenu from "@/components/ui/DropdownMenu";
import type {
  InterviewQuestion,
  QuestionCategory,
  QuestionSource,
} from "@/types/interview-question";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import EditQuestionModal from "./EditQuestionModal";
import UpdateQuestionStatusModal from "./UpdateQuestionStatusModal";
import { formatDate } from "@/constants/format-date";
import { RetryButton } from "@/components/ui/RetryButton";
import { BatchInterviewQuestionActions } from "./BatchInterviewQuestionActions";

type QuestionActionsProps = {
  question: InterviewQuestion;
  onEdit: (questionId: string) => void;
  onUpdateStatus: (questionId: string) => void;
  onSoftDelete: (questionId: string) => void;
  onRestore: (questionId: string) => void;
  onPermanentDelete: (questionId: string) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isRestoring: boolean;
  isPermanentDeleting: boolean;
  isDeletingThisQuestion: boolean;
  isRestoringThisQuestion: boolean;
  isPermanentDeletingThisQuestion: boolean;
  userRole?: string;
};

// Memoized actions dropdown
const QuestionActions = React.memo<QuestionActionsProps>(
  ({
    question,
    onEdit,
    onUpdateStatus,
    onSoftDelete,
    onRestore,
    onPermanentDelete,
    isUpdating,
    isDeleting,
    isRestoring,
    isPermanentDeleting,
    isDeletingThisQuestion,
    isRestoringThisQuestion,
    isPermanentDeletingThisQuestion,
    userRole,
  }) => {
    if (isDeletingThisQuestion || isPermanentDeletingThisQuestion) {
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

    if (isRestoringThisQuestion) {
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
    const isDeleted = !!question.deletedAt;

    // If archived, only technical admins can restore or permanently delete
    if (isDeleted && userRole === "technical_admin") {
      menuItems.push(
        {
          label: "Restore",
          onClick: () => onRestore(question.id),
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
          onClick: () => onPermanentDelete(question.id),
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
    }

    // Technical admins can edit and soft delete active questions
    if (userRole === "technical_admin" && !isDeleted) {
      const canEdit =
        question.status === "pending" || question.status === "to_revise";

      menuItems.push(
        {
          label: canEdit ? "Edit" : "Edit",
          onClick: () => onEdit(question.id),
          disabled: !canEdit || isUpdating || isDeleting,
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
          label: "Archive",
          onClick: () => onSoftDelete(question.id),
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

    // Verifier admins can only update status for active questions
    if (userRole === "verifier_admin" && !isDeleted) {
      const isApproved = question.status === "approved";

      menuItems.push({
        label: isApproved ? "Update Status" : "Update Status",
        onClick: () => onUpdateStatus(question.id),
        disabled: isUpdating || isDeleting || isApproved,
        icon: (
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
            />
          </svg>
        ),
      });
    }

    // If no menu items, show archived message
    if (menuItems.length === 0) {
      return <div className="text-xs text-gray-400 text-center">Archived</div>;
    }

    return (
      <DropdownMenu
        items={menuItems}
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
    );
  }
);

QuestionActions.displayName = "QuestionActions";

// Memoized Checkbox Component
const QuestionCheckbox = React.memo<{
  questionId: string;
  isSelected: boolean;
  onSelect: (questionId: string, checked: boolean) => void;
}>(({ questionId, isSelected, onSelect }) => {
  return (
    <input
      checked={isSelected}
      className="rounded border-gray-300 text-adult-green focus:ring-adult-green"
      type="checkbox"
      onChange={(e) => onSelect(questionId, e.target.checked)}
    />
  );
});

QuestionCheckbox.displayName = "QuestionCheckbox";

const QuestionsTable: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<InterviewQuestion | null>(null);
  const [selectedQuestionForStatus, setSelectedQuestionForStatus] =
    useState<InterviewQuestion | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(
    null
  );
  const [restoringQuestionId, setRestoringQuestionId] = useState<string | null>(
    null
  );
  const [permanentDeletingQuestionId, setPermanentDeletingQuestionId] =
    useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<string[]>([]);

  const { user } = useAdminAuth();

  const {
    questions,
    isLoadingQuestions: loading,
    questionsError,
    softDeleteQuestion,
    restoreQuestion,
    permanentDeleteQuestion,
    isUpdatingStatus,
    isDeleting,
    isRestoring,
    isPermanentDeleting,
    refetchQuestions,
  } = useInterviewQuestions();

  // Filter questions based on view mode (memoized to prevent pagination reset)
  const activeQuestions = useMemo(
    () => questions.filter((q) => !q.deletedAt),
    [questions]
  );
  const archivedQuestions = useMemo(
    () => questions.filter((q) => q.deletedAt),
    [questions]
  );

  // Select which questions to display based on toggle
  const displayQuestions = showArchived ? archivedQuestions : activeQuestions;

  const handleEditQuestion = useCallback(
    (questionId: string) => {
      const question = displayQuestions.find((q) => q.id === questionId);

      if (question) {
        setSelectedQuestion(question);
        setEditModalOpen(true);
      }
    },
    [displayQuestions]
  );

  const handleQuestionUpdated = useCallback(() => {
    refetchQuestions();
    setEditModalOpen(false);
    setSelectedQuestion(null);
  }, [refetchQuestions]);

  const handleCloseEditModal = useCallback(() => {
    setEditModalOpen(false);
    setSelectedQuestion(null);
  }, []);

  const handleUpdateStatus = useCallback(
    (questionId: string) => {
      const question = displayQuestions.find((q) => q.id === questionId);

      if (question) {
        setSelectedQuestionForStatus(question);
        setStatusModalOpen(true);
      }
    },
    [displayQuestions]
  );

  const handleStatusUpdated = useCallback(() => {
    refetchQuestions();
    setStatusModalOpen(false);
    setSelectedQuestionForStatus(null);
  }, [refetchQuestions]);

  const handleCloseStatusModal = useCallback(() => {
    setStatusModalOpen(false);
    setSelectedQuestionForStatus(null);
  }, []);

  const handleSoftDelete = useCallback(
    (questionId: string) => {
      if (!confirm("Are you sure you want to archive this question?")) return;

      setDeletingQuestionId(questionId);
      softDeleteQuestion(questionId, {
        onSuccess: (response) => {
          if (response.success) {
            addToast({
              title: response.message || "Question archived successfully",
              color: "success",
              timeout: 4000,
            });
          }
          setDeletingQuestionId(null);
        },
        onError: (error: any) => {
          addToast({
            title: error?.message || "Failed to archive question",
            color: "danger",
            timeout: 4000,
          });
          setDeletingQuestionId(null);
        },
      });
    },
    [softDeleteQuestion]
  );

  const handleRestore = useCallback(
    (questionId: string) => {
      if (!confirm("Are you sure you want to restore this question?")) return;

      setRestoringQuestionId(questionId);
      restoreQuestion(questionId, {
        onSuccess: (response) => {
          if (response.success) {
            addToast({
              title: response.message || "Question restored successfully",
              color: "success",
              timeout: 4000,
            });
          }
          setRestoringQuestionId(null);
        },
        onError: (error: any) => {
          addToast({
            title: error?.message || "Failed to restore question",
            color: "danger",
            timeout: 4000,
          });
          setRestoringQuestionId(null);
        },
      });
    },
    [restoreQuestion]
  );

  const handlePermanentDelete = useCallback(
    (questionId: string) => {
      if (
        !confirm(
          "Are you sure you want to permanently delete this question? This action cannot be undone!"
        )
      )
        return;

      setPermanentDeletingQuestionId(questionId);
      permanentDeleteQuestion(questionId, {
        onSuccess: (response) => {
          if (response.success) {
            addToast({
              title: response.message || "Question permanently deleted",
              color: "success",
              timeout: 4000,
            });
          }
          setPermanentDeletingQuestionId(null);
        },
        onError: (error: any) => {
          addToast({
            title: error?.message || "Failed to permanently delete question",
            color: "danger",
            timeout: 4000,
          });
          setPermanentDeletingQuestionId(null);
        },
      });
    },
    [permanentDeleteQuestion]
  );

  const handleSelectQuestion = useCallback(
    (questionId: string, checked: boolean) => {
      if (checked) {
        setSelectedQuestionIds((prev) => [...prev, questionId]);
      } else {
        setSelectedQuestionIds((prev) =>
          prev.filter((id) => id !== questionId)
        );
      }
    },
    []
  );

  React.useEffect(() => {
    setSelectedQuestionIds([]);
  }, [showArchived]);

  // Status badge color mapping
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    to_revise: "bg-blue-100 text-blue-800",
  };

  const statusLabels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    to_revise: "To Revise",
  };

  // Category labels
  const categoryLabels: Record<QuestionCategory, string> = {
    behavioral: "Behavioral",
    technical: "Technical",
    situational: "Situational",
    background: "Background",
  };

  // Source labels
  const sourceLabels: Record<QuestionSource, string> = {
    ai: "AI Suggested",
    manual: "Manual",
  };

  const columns: ColumnDef<InterviewQuestion>[] = useMemo(
    () => [
      {
        id: "select",
        header: "",
        cell: ({ row }) => (
          <QuestionCheckbox
            isSelected={selectedQuestionIds.includes(row.original.id)}
            questionId={row.original.id}
            onSelect={handleSelectQuestion}
          />
        ),
        size: 50,
        enableSorting: false,
      },
      {
        accessorKey: "question",
        header: "Question",
        cell: ({ row }) => (
          <div className="max-w-md whitespace-normal break-words">
            <p
              className={`font-medium ${
                row.original.deletedAt
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {row.original.question}
            </p>
          </div>
        ),
        size: 250,
      },
      {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {categoryLabels[row.original.category]}
          </span>
        ),
      },
      {
        accessorKey: "industry",
        header: "Industry",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">
            {row.original.industry ? (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {row.original.industry
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </span>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        size: 150,
      },
      {
        accessorKey: "jobRoles",
        header: "Job Roles",
        cell: ({ row }) => (
          <div className="text-sm text-gray-700">
            {row.original.jobRoles && row.original.jobRoles.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {row.original.jobRoles.map((role: string, index: number) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {role}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "source",
        header: "Source",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              row.original.source === "ai"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {sourceLabels[row.original.source]}
          </span>
        ),
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
          <div className="flex flex-col gap-1">
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                statusColors[row.original.status]
              }`}
            >
              {statusLabels[row.original.status]}
            </span>
            {row.original.deletedAt && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Archived
              </span>
            )}
          </div>
        ),
        size: 120,
      },
      {
        accessorKey: "reason",
        header: "Reason",
        cell: ({ row }) => (
          <div className="max-w-xs whitespace-normal break-words">
            {row.original.reason ? (
              <p
                className={`text-sm ${
                  row.original.deletedAt ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {row.original.reason}
              </p>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <div className="text-gray-900 whitespace-normal">
            {formatDate(row.original.createdAt)}
          </div>
        ),
      },
      {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => (
          <div className="text-gray-600 text-sm">
            {row.original.deletedAt ? (
              <>
                <div className="text-red-600 font-medium">
                  {formatDate(row.original.deletedAt)}
                </div>
                {row.original.deletedByEmail && (
                  <div className="text-xs text-gray-500 mt-1">
                    Archived by: {row.original.deletedByEmail}
                  </div>
                )}
              </>
            ) : row.original.updatedAt ? (
              <>
                <div>{formatDate(row.original.updatedAt)}</div>
                {row.original.updatedByEmail && (
                  <div className="text-xs text-gray-500 mt-1">
                    by: {row.original.updatedByEmail}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
        size: 180,
      },
      {
        id: "actions",
        header: "",
        cell: ({ row }) => (
          <QuestionActions
            isDeleting={isDeleting}
            isDeletingThisQuestion={deletingQuestionId === row.original.id}
            isPermanentDeleting={isPermanentDeleting}
            isPermanentDeletingThisQuestion={
              permanentDeletingQuestionId === row.original.id
            }
            isRestoring={isRestoring}
            isRestoringThisQuestion={restoringQuestionId === row.original.id}
            isUpdating={isUpdatingStatus}
            question={row.original}
            userRole={user?.role}
            onEdit={handleEditQuestion}
            onPermanentDelete={handlePermanentDelete}
            onRestore={handleRestore}
            onSoftDelete={handleSoftDelete}
            onUpdateStatus={handleUpdateStatus}
          />
        ),
        width: "80px",
      },
    ],
    [
      formatDate,
      handleEditQuestion,
      handleUpdateStatus,
      handleSoftDelete,
      handleRestore,
      handlePermanentDelete,
      handleSelectQuestion,
      isUpdatingStatus,
      isDeleting,
      isRestoring,
      isPermanentDeleting,
      deletingQuestionId,
      restoringQuestionId,
      permanentDeletingQuestionId,
      selectedQuestionIds,
      user?.role,
    ]
  );

  // Error state
  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">
          Failed to load questions. Please try again.
        </p>
        <RetryButton onRetry={refetchQuestions} />
      </div>
    );
  }

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
            Active Questions ({activeQuestions.length})
          </button>
          <button
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showArchived
                ? "bg-adult-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
            onClick={() => setShowArchived(true)}
          >
            Archived Questions ({archivedQuestions.length})
          </button>
        </div>
      </div>
      <BatchInterviewQuestionActions
        isArchiveView={showArchived}
        selectedQuestionIds={selectedQuestionIds}
        onClearSelection={() => setSelectedQuestionIds([])}
      />
      <AdminTable
        columns={columns}
        data={displayQuestions}
        isLoading={loading}
        searchPlaceholder={
          showArchived
            ? "Search archived questions..."
            : "Search interview questions..."
        }
      />
      {selectedQuestion && (
        <EditQuestionModal
          open={editModalOpen}
          question={selectedQuestion}
          onClose={handleCloseEditModal}
          onQuestionUpdated={handleQuestionUpdated}
        />
      )}
      <UpdateQuestionStatusModal
        open={statusModalOpen}
        question={selectedQuestionForStatus}
        onClose={handleCloseStatusModal}
        onStatusUpdated={handleStatusUpdated}
      />
    </>
  );
};

export default React.memo(QuestionsTable);
