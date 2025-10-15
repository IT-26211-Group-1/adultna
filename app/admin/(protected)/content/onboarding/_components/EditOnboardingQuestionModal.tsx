"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useOnboardingQuestions } from "@/hooks/queries/admin/useOnboardingQueries";
import {
  EditOnboardingQuestionModalProps,
  EditQuestionForm,
} from "@/types/onboarding";

const categoryOptions = [
  { value: "life_stage", label: "Life Stage" },
  { value: "priorities", label: "Priorities" },
];

export default function EditOnboardingQuestionModal({
  open = false,
  question,
  onClose = () => {},
  onQuestionUpdated,
}: EditOnboardingQuestionModalProps) {
  if (!question) {
    return (
      <Modal open={open} title="Edit Onboarding Question" onClose={onClose}>
        <div className="flex items-center justify-center py-8">
          <svg
            className="animate-spin h-8 w-8 text-adult-green"
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
      </Modal>
    );
  }

  return (
    <EditForm
      question={question}
      open={open}
      onClose={onClose}
      onQuestionUpdated={onQuestionUpdated}
    />
  );
}

function EditForm({
  question,
  open,
  onClose,
  onQuestionUpdated,
}: {
  question: NonNullable<EditOnboardingQuestionModalProps["question"]>;
  open: boolean;
  onClose: () => void;
  onQuestionUpdated?: () => void;
}) {
  const { updateQuestion, isUpdating } = useOnboardingQuestions();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditQuestionForm>({
    defaultValues: {
      question: question.question,
      category: question.category,
    },
  });

  const currentQuestion = watch("question");
  const currentCategory = watch("category");

  const onSubmit = useCallback(
    async (data: EditQuestionForm) => {
      try {
        const hasChanges =
          data.question !== question.question ||
          data.category !== question.category;

        if (!hasChanges) {
          addToast({
            title: "No changes to save",
            color: "warning",
            timeout: 3000,
          });
          onClose();

          return;
        }

        updateQuestion(
          {
            questionId: question.id,
            question: data.question,
            category: data.category,
          },
          {
            onSuccess: (response) => {
              if (response.success) {
                addToast({
                  title: response.message || "Question updated successfully",
                  color: "success",
                  timeout: 4000,
                });
                onQuestionUpdated?.();
              }
            },
            onError: (error: any) => {
              addToast({
                title:
                  error?.data?.message ||
                  error?.message ||
                  "Failed to update question",
                color: "danger",
                timeout: 4000,
              });
            },
          }
        );
      } catch {
        addToast({
          title: "Failed to update question",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [question, updateQuestion, onQuestionUpdated, onClose]
  );

  const handleClose = useCallback(() => {
    reset({
      question: question.question,
      category: question.category,
    });
    onClose();
  }, [reset, question, onClose]);

  const isLoading = isSubmitting || isUpdating;

  const hasChanges =
    currentQuestion !== question.question ||
    currentCategory !== question.category;

  return (
    <Modal open={open} title="Edit Onboarding Question" onClose={handleClose}>
      <form
        key={question.id}
        className="space-y-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="question"
          >
            Question *
          </label>
          <input
            {...register("question", {
              required: "Question is required",
              minLength: {
                value: 5,
                message: "Question must be at least 5 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            disabled={isLoading}
            id="question"
            placeholder="Enter question text"
            type="text"
          />
          {errors.question && (
            <p className="mt-1 text-sm text-red-600">
              {errors.question.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="category"
          >
            Category *
          </label>
          <select
            {...register("category", { required: "Category is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            disabled={isLoading}
            id="category"
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600">
              {errors.category.message}
            </p>
          )}
        </div>

        {question && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Question Information
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p>
                <strong>ID:</strong> #{question.id}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span className="capitalize">
                  {question.status
                    ?.split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ") || "N/A"}
                </span>
              </p>
              <p>
                <strong>Created:</strong>{" "}
                {question.createdAt
                  ? new Date(question.createdAt).toLocaleString()
                  : "N/A"}
              </p>
              {question.updatedAt && question.updatedAt !== null && (
                <p>
                  <strong>Updated:</strong>{" "}
                  {new Date(question.updatedAt).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            disabled={isLoading}
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            disabled={isLoading || !hasChanges}
            loading={isLoading}
            type="submit"
          >
            {!hasChanges ? "No Changes" : "Update Question"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
