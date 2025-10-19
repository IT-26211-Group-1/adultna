"use client";

import React, { useState, useCallback, useMemo } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
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

const QuestionStatusBadge = React.memo<{ status: QuestionStatus }>(
  ({ status }) => {
    const getStatusColor = (status: QuestionStatus) => {
      switch (status) {
        case "accepted":
          return "success";
        case "rejected":
          return "error";
        case "to_revise":
          return "warning";
        case "pending":
        default:
          return "info";
      }
    };

    return (
      <Badge size="sm" variant={getStatusColor(status)}>
        {status
          .split("_")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}
      </Badge>
    );
  },
);

QuestionStatusBadge.displayName = "QuestionStatusBadge";

const QuestionCategoryBadge = React.memo<{ category: string }>(
  ({ category }) => (
    <Badge size="sm" variant="default">
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  ),
);

QuestionCategoryBadge.displayName = "QuestionCategoryBadge";

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

  const columns: Column<OnboardingQuestion>[] = useMemo(
    () => [
      {
        header: "Question",
        accessor: (question: OnboardingQuestion) => (
          <div className="max-w-md whitespace-normal break-words">
            <p
              className={`font-medium ${
                question.deletedAt
                  ? "text-gray-400 line-through"
                  : "text-gray-900"
              }`}
            >
              {question.question}
            </p>
          </div>
        ),
        width: "250px",
      },
      {
        header: "Answer Options",
        accessor: (question: OnboardingQuestion) => (
          <div className="text-gray-600 text-sm whitespace-normal break-words">
            {question.options && question.options.length > 0 ? (
              <ul className="list-disc list-inside">
                {question.options.map((option: AnswerOption, index: number) => (
                  <li key={option.id || index} className="max-w-xs whitespace-normal break-words">
                    {option.optionText}
                  </li>
                ))}
              </ul>
            ) : (
              <span className="text-gray-400">No options</span>
            )}
          </div>
        ),
        width: "200px",
      },

      {
        header: "Status",
        accessor: (question: OnboardingQuestion) => (
          <div className="flex flex-col gap-1">
            <QuestionStatusBadge status={question.status} />
            {question.deletedAt && (
              <Badge size="sm" variant="error">
                Archived
              </Badge>
            )}
          </div>
        ),
  width: "120px",
      },
      {
        header: "Notes/Reason",
        accessor: (question: OnboardingQuestion) => (
          <div className="text-gray-600 text-sm max-w-[250px] whitespace-normal break-words">
            {question.reason ? (
              <div className="italic break-words break-all whitespace-normal">
                {question.reason}
              </div>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
        width: "250px",
      },
      {
        header: "Created At",
        accessor: (question: OnboardingQuestion) => (
          <div className="text-gray-600 text-sm">
            <div>{formatDate(question.createdAt)}</div>
            {question.createdByEmail && (
              <div className="text-xs text-gray-500 mt-1">
                by: {question.createdByEmail}
              </div>
            )}
          </div>
        ),
  width: "180px",
      },
      {
        header: "Updated At",
        accessor: (question: OnboardingQuestion) => (
          <div className="text-gray-600 text-sm">
            {question.deletedAt ? (
              <>
                <div className="text-red-600 font-medium">
                  {formatDate(question.deletedAt)}
                </div>
                {question.deletedByEmail && (
                  <div className="text-xs text-gray-500 mt-1">
                    Archived by: {question.deletedByEmail}
                  </div>
                )}
              </>
            ) : question.updatedAt ? (
              <>
                <div>{formatDate(question.updatedAt)}</div>
                {question.updatedByEmail && (
                  <div className="text-xs text-gray-500 mt-1">
                    by: {question.updatedByEmail}
                  </div>
                )}
              </>
            ) : (
              <span className="text-gray-400">-</span>
            )}
          </div>
        ),
  width: "180px",
      },
      {
        header: "",
        accessor: (question: OnboardingQuestion) => (
          <QuestionActions
            isDeleting={isDeleting}
            isDeletingThisQuestion={deletingQuestionId === question.id}
            isPermanentDeleting={isPermanentDeleting}
            isPermanentDeletingThisQuestion={
              permanentDeletingQuestionId === question.id
            }
            isRestoring={isRestoring}
            isRestoringThisQuestion={restoringQuestionId === question.id}
            isUpdating={isUpdatingStatus}
            question={question}
            userRole={user?.role}
            onDelete={handleDelete}
            onEdit={handleEditQuestion}
            onPermanentDelete={handlePermanentDelete}
            onRestore={handleRestore}
            onUpdateStatus={handleUpdateStatus}
          />
        ),
        width: "80px",
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
      formatDate,
    ],
  );

  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading questions</p>
        <button
          className="mt-4 px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90"
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
      <Table
        columns={columns}
        data={displayQuestions}
        emptyMessage={
          showArchived
            ? "No archived questions found"
            : "No onboarding questions found"
        }
        loading={loading}
        className="!overflow-visible"
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
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
