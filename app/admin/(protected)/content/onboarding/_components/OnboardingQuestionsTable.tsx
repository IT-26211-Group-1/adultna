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
  }
);

QuestionStatusBadge.displayName = "QuestionStatusBadge";

const QuestionCategoryBadge = React.memo<{ category: string }>(
  ({ category }) => (
    <Badge size="sm" variant="default">
      {category.charAt(0).toUpperCase() + category.slice(1)}
    </Badge>
  )
);

QuestionCategoryBadge.displayName = "QuestionCategoryBadge";

type QuestionActionsProps = {
  question: OnboardingQuestion;
  onEdit: (questionId: number) => void;
  onUpdateStatus: (questionId: number) => void;
  onDelete: (questionId: number) => void;
  isUpdating: boolean;
  isDeleting: boolean;
  isDeletingThisQuestion: boolean;
  userRole?: string;
};

const QuestionActions = React.memo<QuestionActionsProps>(
  ({
    question,
    onEdit,
    onUpdateStatus,
    onDelete,
    isUpdating,
    isDeleting,
    isDeletingThisQuestion,
    userRole,
  }) => {
    if (isDeletingThisQuestion) {
      return (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-5 w-5 text-red-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      );
    }

    const menuItems = [];
    const isDeleted = !!question.deletedAt;

    // Technical admins can edit and delete
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
        }
      );
    }

    // Verifier admins can only update status
    if (userRole === "verifier_admin" && !isDeleted) {
      menuItems.push({
        label: "Update Status",
        onClick: () => onUpdateStatus(question.id),
        disabled: isUpdating || isDeleting,
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

    // If deleted, show a disabled info message
    if (isDeleted) {
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

const OnboardingQuestionsTable: React.FC = () => {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] =
    useState<OnboardingQuestion | null>(null);
  const [selectedQuestionForStatus, setSelectedQuestionForStatus] =
    useState<OnboardingQuestion | null>(null);
  const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(
    null
  );
  const [showArchived, setShowArchived] = useState(false);

  const { user } = useAdminAuth();

  const {
    questions,
    questionsCount,
    isLoadingQuestions: loading,
    questionsError,
    updateQuestionStatus,
    isUpdatingStatus,
    deleteQuestion,
    isDeleting,
    refetchQuestions,
  } = useOnboardingQuestions();

  // Filter questions based on view mode
  const activeQuestions = questions.filter(q => !q.deletedAt);
  const archivedQuestions = questions.filter(q => q.deletedAt);

  // Select which questions to display based on toggle
  const displayQuestions = showArchived ? archivedQuestions : activeQuestions;

  // Debug: log questions data
  console.log("Questions with options:", questions);
  console.log("Active questions:", activeQuestions.length);
  console.log("Archived questions:", archivedQuestions.length);

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
    (questionId: number) => {
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
        }
      );
    },
    [deleteQuestion]
  );

  const columns: Column<OnboardingQuestion>[] = useMemo(
    () => [
      {
        header: "Question",
        accessor: (question: OnboardingQuestion) => (
          <div className="max-w-md">
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
          <div className="text-gray-600 text-sm">
            {question.options && question.options.length > 0 ? (
              <ul className="list-disc list-inside">
                {question.options.map((option: AnswerOption, index: number) => (
                  <li key={option.id || index} className="truncate max-w-xs">
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
          <div className="text-gray-600 text-sm max-w-[250px]">
            {question.reason ? (
              <div className="italic break-words">
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
            question={question}
            onEdit={handleEditQuestion}
            onUpdateStatus={handleUpdateStatus}
            onDelete={handleDelete}
            isUpdating={isUpdatingStatus}
            isDeleting={isDeleting}
            isDeletingThisQuestion={deletingQuestionId === question.id}
            userRole={user?.role}
          />
        ),
        width: "80px",
      },
    ],
    [
      handleEditQuestion,
      handleUpdateStatus,
      handleDelete,
      isUpdatingStatus,
      isDeleting,
      deletingQuestionId,
      user?.role,
    ]
  );

  if (questionsError) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600">Error loading questions</p>
        <button
          onClick={() => refetchQuestions()}
          className="mt-4 px-4 py-2 bg-adult-green text-white rounded-md hover:bg-adult-green/90"
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
            onClick={() => setShowArchived(false)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              !showArchived
                ? "bg-adult-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Active Questions ({activeQuestions.length})
          </button>
          <button
            onClick={() => setShowArchived(true)}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              showArchived
                ? "bg-adult-green text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            Archived Questions ({archivedQuestions.length})
          </button>
        </div>
      </div>
      <Table
        columns={columns}
        data={displayQuestions}
        loading={loading}
        emptyMessage={
          showArchived
            ? "No archived questions found"
            : "No onboarding questions found"
        }
      />
      {selectedQuestion && (
        <EditOnboardingQuestionModal
          open={editModalOpen}
          onClose={handleCloseEditModal}
          onQuestionUpdated={handleQuestionUpdated}
          questionId={selectedQuestion.id}
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
