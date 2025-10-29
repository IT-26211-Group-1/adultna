"use client";

import React, { useState, useMemo, useCallback } from "react";
import Table, { Column } from "@/components/ui/Table";
import Badge from "@/components/ui/Badge";
import DropdownMenu from "@/components/ui/DropdownMenu";
import type {
  InterviewQuestion,
  QuestionStatus,
  QuestionCategory,
  QuestionSource,
} from "@/types/interview-question";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import EditQuestionModal from "./EditQuestionModal";
import UpdateQuestionStatusModal from "./UpdateQuestionStatusModal";
import { formatDate } from "@/constants/formatDate";

// Question Status Badge Component
const QuestionStatusBadge = React.memo<{ status: QuestionStatus }>(
  ({ status }) => {
    const variants = {
      pending: "warning",
      approved: "success",
      rejected: "error",
      to_revise: "info",
    } as const;

    const labels = {
      pending: "Pending",
      approved: "Approved",
      rejected: "Rejected",
      to_revise: "To Revise",
    };

    return (
      <Badge size="sm" variant={variants[status]}>
        {labels[status]}
      </Badge>
    );
  }
);

QuestionStatusBadge.displayName = "QuestionStatusBadge";

// Question Category Badge Component
const QuestionCategoryBadge = React.memo<{
  category: QuestionCategory;
}>(({ category }) => {
  const labels: Record<QuestionCategory, string> = {
    behavioral: "Behavioral",
    technical: "Technical",
    situational: "Situational",
    background: "Background",
  };

  return (
    <Badge size="sm" variant="default">
      {labels[category]}
    </Badge>
  );
});

QuestionCategoryBadge.displayName = "QuestionCategoryBadge";

// Question Source Badge Component
const QuestionSourceBadge = React.memo<{ source: QuestionSource }>(
  ({ source }) => {
    const labels: Record<QuestionSource, string> = {
      ai: "AI Suggested",
      manual: "Manual",
    };

    return (
      <Badge size="sm" variant={source === "ai" ? "info" : "default"}>
        {labels[source]}
      </Badge>
    );
  }
);

QuestionSourceBadge.displayName = "QuestionSourceBadge";

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

  // Filter questions based on view mode
  const activeQuestions = questions.filter((q) => !q.deletedAt);
  const archivedQuestions = questions.filter((q) => q.deletedAt);

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

  const columns: Column<InterviewQuestion>[] = useMemo(
    () => [
      {
        header: "Question",
        accessor: (question) => (
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
        header: "Category",
        accessor: (question) => (
          <QuestionCategoryBadge category={question.category} />
        ),
      },
      {
        header: "Industry",
        accessor: (question) => (
          <div className="text-sm text-gray-700">
            {question.industry ? (
              <Badge size="sm" variant="default">
                {question.industry
                  .replace(/_/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </Badge>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        width: "150px",
      },
      {
        header: "Job Roles",
        accessor: (question) => (
          <div className="text-sm text-gray-700">
            {question.jobRoles && question.jobRoles.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {question.jobRoles.map((role, index) => (
                  <Badge key={index} size="sm" variant="default">
                    {role}
                  </Badge>
                ))}
              </div>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        width: "200px",
      },
      {
        header: "Source",
        accessor: (question) => (
          <QuestionSourceBadge source={question.source} />
        ),
      },
      {
        header: "Status",
        accessor: (question) => (
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
        header: "Reason",
        accessor: (question) => (
          <div className="max-w-xs whitespace-normal break-words">
            {question.reason ? (
              <p
                className={`text-sm ${
                  question.deletedAt ? "text-gray-400" : "text-gray-700"
                }`}
              >
                {question.reason}
              </p>
            ) : (
              <span className="text-gray-400 text-sm">-</span>
            )}
          </div>
        ),
        width: "200px",
      },
      {
        header: "Created At",
        accessor: (question) => (
          <div className="text-gray-900 whitespace-normal">
            {formatDate(question.createdAt)}
          </div>
        ),
      },
      {
        header: "Updated At",
        accessor: (question) => (
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
        accessor: (question) => (
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
      isUpdatingStatus,
      isDeleting,
      isRestoring,
      isPermanentDeleting,
      deletingQuestionId,
      restoringQuestionId,
      permanentDeletingQuestionId,
      user?.role,
    ]
  );

  // Error state
  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">
          Failed to load questions. Please try again.
        </p>
        <button
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
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
        className="!overflow-visible"
        columns={columns}
        data={displayQuestions}
        emptyMessage={
          showArchived
            ? "No archived questions found"
            : "No interview questions found"
        }
        loading={loading}
        pagination={{
          enabled: true,
          pageSize: 10,
          pageSizeOptions: [10, 25, 50, 100],
        }}
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
