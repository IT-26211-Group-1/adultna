"use client";

import React, { useState, useCallback, useMemo } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { AdminTable } from "@/components/admin/AdminTable";
import DropdownMenu from "@/components/ui/DropdownMenu";
import { addToast } from "@heroui/toast";
import {
  useOnboardingQuestions,
  OnboardingQuestion,
  QuestionStatus,
  AnswerOption,
} from "@/hooks/queries/admin/useOnboardingQueries";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import EditOnboardingQuestionModal from "./EditOnboardingQuestionModal";
import UpdateQuestionStatusModal from "./UpdateQuestionStatusModal";
import { BatchQuestionActions } from "./BatchQuestionActions";
import { formatDate } from "@/constants/format-date";
import { RetryButton } from "@/components/ui/RetryButton";

type QuestionActionsProps = {
  question: OnboardingQuestion;
  onEdit: (questionId: number) => void;
  onUpdateStatus: (questionId: number) => void;
  onDelete: (questionId: number) => void;
  onRestore: (questionId: number) => void;
  onPermanentDelete: (questionId: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isRestoring: boolean;
  isPermanentDeleting: boolean;
  isDeletingThisQuestion: boolean;
  isRestoringThisQuestion: boolean;
  isPermanentDeletingThisQuestion: boolean;
  userRole?: string;
};

const QuestionActions = React.memo<QuestionActionsProps>(
  ({
    question,
    onEdit,
    onUpdateStatus,
    onDelete,
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
        },
      );
    }

    // Technical admins can edit and delete active questions
    if (userRole === "technical_admin" && !isDeleted) {
      menuItems.push(
        {
          label: "Edit",
          onClick: () => onEdit(question.id),
          disabled: isUpdating || isDeleting,
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
          onClick: () => onDelete(question.id),
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
        },
      );
    }

    // Verifier admins can only update status for active questions
    if (userRole === "verifier_admin" && !isDeleted) {
      const isStatusLocked =
        question.status === "accepted" || question.status === "rejected";

      menuItems.push({
        label: isStatusLocked ? "Update Status" : "Update Status",
        onClick: () => onUpdateStatus(question.id),
        disabled: isUpdating || isDeleting || isStatusLocked,
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
  },
);

QuestionActions.displayName = "QuestionActions";

const OnboardingQuestionsTable: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<OnboardingQuestion | null>(null);
  const [selectedQuestionForStatus, setSelectedQuestionForStatus] =
    useState<OnboardingQuestion | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null,
  );
  const [restoringQuestionId, setRestoringQuestionId] = useState<number | null>(
    null,
  );
  const [permanentDeletingQuestionId, setPermanentDeletingQuestionId] =
    useState<number | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<number[]>([]);

  const { user } = useAdminAuth();

  const {
    questions,
    isLoadingQuestions: loading,
    questionsError,
    isUpdatingStatus,
    deleteQuestion,
    isDeleting,
    restoreQuestion,
    isRestoring,
    permanentDeleteQuestion,
    isPermanentDeleting,
    refetchQuestions,
  } = useOnboardingQuestions();

  // Filter questions based on view mode
  const activeQuestions = questions.filter((q) => !q.deletedAt);
  const archivedQuestions = questions.filter((q) => q.deletedAt);

  // Select which questions to display based on toggle
  const displayQuestions = showArchived ? archivedQuestions : activeQuestions;

  const handleEditQuestion = useCallback(
    (questionId: number) => {
      const question = displayQuestions.find((q) => q.id === questionId);

      if (question) {
        setSelectedQuestion(question);
        setEditModalOpen(true);
      }
    },
    [displayQuestions],
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
    (questionId: number) => {
      const question = displayQuestions.find((q) => q.id === questionId);

      if (question) {
        setSelectedQuestionForStatus(question);
        setStatusModalOpen(true);
      }
    },
    [displayQuestions],
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

  const handleDelete = useCallback(
    (questionId: number) => {
      if (!confirm("Are you sure you want to archive this question?")) return;

      setDeletingQuestionId(questionId);
      deleteQuestion(
        { questionId },
        {
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
        },
      );
    },
    [deleteQuestion],
  );

  const handleRestore = useCallback(
    (questionId: number) => {
      if (!confirm("Are you sure you want to restore this question?")) return;

      setRestoringQuestionId(questionId);
      restoreQuestion(
        { questionId },
        {
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
        },
      );
    },
    [restoreQuestion],
  );

  const handlePermanentDelete = useCallback(
    (questionId: number) => {
      if (
        !confirm(
          "Are you sure you want to permanently delete this question? This action cannot be undone!",
        )
      )
        return;

      setPermanentDeletingQuestionId(questionId);
      permanentDeleteQuestion(
        { questionId },
        {
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
        },
      );
    },
    [permanentDeleteQuestion],
  );

  // Selection handler
  const handleSelectQuestion = useCallback(
    (questionId: number, checked: boolean) => {
      if (checked) {
        setSelectedQuestionIds((prev) => [...prev, questionId]);
      } else {
        setSelectedQuestionIds((prev) =>
          prev.filter((id) => id !== questionId),
        );
      }
    },
    [],
  );

  // Clear selection when switching between active/archived views
  React.useEffect(() => {
    setSelectedQuestionIds([]);
  }, [showArchived]);

  // Table columns for @tanstack/react-table
  const columns: ColumnDef<OnboardingQuestion>[] = useMemo(
    () => [
      {
        id: "select",
        header: "",
        cell: ({ row }) => (
          <input
            checked={selectedQuestionIds.includes(row.original.id)}
            className="rounded border-gray-300 text-adult-green focus:ring-adult-green"
            type="checkbox"
            onChange={(e) =>
              handleSelectQuestion(row.original.id, e.target.checked)
            }
          />
        ),
        size: 50,
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
              {row.getValue("question")}
            </p>
          </div>
        ),
        size: 250,
      },
      {
        id: "options",
        header: "Answer Options",
        cell: ({ row }) => (
          <div className="text-gray-600 text-sm whitespace-normal break-words">
            {row.original.options && row.original.options.length > 0 ? (
              <ul className="list-disc list-inside">
                {row.original.options.map((option: AnswerOption, index: number) => (
                  <li
                    key={option.id || index}
                    className="max-w-xs whitespace-normal break-words"
                  >
                    {option.optionText}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">No options</span>
            )}
          </div>
        ),
        size: 200,
      },
      {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
          const status = row.getValue("status") as QuestionStatus;
          const statusColors = {
            accepted: "bg-green-100 text-green-800",
            rejected: "bg-red-100 text-red-800",
            to_revise: "bg-yellow-100 text-yellow-800",
            pending: "bg-blue-100 text-blue-800",
          };
          return (
            <div className="flex flex-col gap-1">
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}>
                {status
                  .split("_")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ")}
              </span>
              {row.original.deletedAt && (
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  Archived
                </span>
              )}
            </div>
          );
        },
        size: 120,
      },
      {
        accessorKey: "reason",
        header: "Notes/Reason",
        cell: ({ row }) => (
          <div className="text-gray-600 text-sm max-w-[250px] whitespace-normal break-words">
            {row.getValue("reason") ? (
              <div className="italic break-words break-all whitespace-normal">
                {row.getValue("reason")}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
        size: 250,
      },
      {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => (
          <div className="text-gray-600 text-sm">
            <div>{formatDate(row.getValue("createdAt"))}</div>
            {row.original.createdByEmail && (
              <div className="text-xs text-gray-500 mt-1">
                by: {row.original.createdByEmail}
              </div>
            )}
          </div>
        ),
        size: 180,
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
            ) : row.getValue("updatedAt") ? (
              <>
                <div>{formatDate(row.getValue("updatedAt"))}</div>
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
            onDelete={handleDelete}
            onEdit={handleEditQuestion}
            onPermanentDelete={handlePermanentDelete}
            onRestore={handleRestore}
            onUpdateStatus={handleUpdateStatus}
          />
        ),
        size: 80,
      },
    ],
    [
      handleEditQuestion,
      handleUpdateStatus,
      handleDelete,
      handleRestore,
      handlePermanentDelete,
      isUpdatingStatus,
      isDeleting,
      isRestoring,
      isPermanentDeleting,
      deletingQuestionId,
      restoringQuestionId,
      permanentDeletingQuestionId,
      user?.role,
      selectedQuestionIds,
      handleSelectQuestion,
    ],
  );

  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">Error loading questions</p>
        <button
          className="px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90"
          onClick={() => refetchQuestions()}
        >
          Retry
        </button>
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

      {/* Batch Actions */}
      <BatchQuestionActions
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
            : "Search onboarding questions..."
        }
      />
      {selectedQuestion && (
        <EditOnboardingQuestionModal
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

export default OnboardingQuestionsTable;
