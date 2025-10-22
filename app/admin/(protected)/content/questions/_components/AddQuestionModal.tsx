"use client";

import React, { memo, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import type {
  QuestionCategory,
  QuestionSource,
} from "@/types/interview-question";

type AddQuestionForm = {
  question: string;
  category: QuestionCategory;
  source: QuestionSource;
  customCategory?: string;
};

type AddQuestionModalProps = {
  open?: boolean;
  onClose?: () => void;
};

function AddQuestionModal({
  open = false,
  onClose = () => {},
}: AddQuestionModalProps) {
  const { createQuestion, isCreatingQuestion } = useInterviewQuestions();

  const categoryOptions: { value: QuestionCategory; label: string }[] = useMemo(
    () => [
      { value: "behavioral", label: "Behavioral" },
      { value: "technical", label: "Technical" },
      { value: "situational", label: "Situational" },
      { value: "other", label: "Other" },
    ],
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<AddQuestionForm>({
    defaultValues: {
      question: "",
      category: "behavioral",
      source: "manual",
      customCategory: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = useCallback(
    handleSubmit(async (data: AddQuestionForm) => {
      // If "other" is selected and customCategory is provided, use it as the category
      const submissionData = {
        question: data.question,
        category:
          data.category === "other" && data.customCategory
            ? (data.customCategory as QuestionCategory)
            : data.category,
        source: data.source,
      };

      createQuestion(submissionData, {
        onSuccess: (response) => {
          if (response.success) {
            handleClose();

            addToast({
              title: response.message || "Question created successfully",
              color: "success",
              timeout: 4000,
            });
          }
        },
        onError: (error: any) => {
          addToast({
            title: error?.message || "Failed to create question",
            color: "danger",
            timeout: 4000,
          });
        },
      });
    }),
    [createQuestion, handleSubmit]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Modal open={open} title="Add New Question" onClose={handleClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="question"
          >
            Question *
          </label>
          <textarea
            {...register("question", {
              required: "Question is required",
              minLength: {
                value: 10,
                message: "Question must be at least 10 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="question"
            placeholder="Enter interview question"
            rows={4}
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

        {selectedCategory === "other" && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="customCategory"
            >
              Please specify the category *
            </label>
            <input
              {...register("customCategory", {
                required:
                  selectedCategory === "other"
                    ? "Please specify the category"
                    : false,
                minLength: {
                  value: 2,
                  message: "Category must be at least 2 characters",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              id="customCategory"
              placeholder="Enter custom category"
              type="text"
            />
            {errors.customCategory && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customCategory.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            disabled={isCreatingQuestion}
            onClick={handleClose}
            type="button"
          >
            Cancel
          </button>
          <LoadingButton
            disabled={isCreatingQuestion}
            loading={isCreatingQuestion}
            type="submit"
          >
            Add Question
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(AddQuestionModal);
