"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
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
  const {
    createQuestion,
    isCreatingQuestion,
    generateAIQuestion,
    isGeneratingAI,
  } = useInterviewQuestions();
  const [showConfirmation, setShowConfirmation] = useState(false);

  const categoryOptions: { value: QuestionCategory; label: string }[] = useMemo(
    () => [
      { value: "behavioral", label: "Behavioral" },
      { value: "technical", label: "Technical" },
      { value: "situational", label: "Situational" },
      { value: "background", label: "Background" },
    ],
    []
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<AddQuestionForm>({
    defaultValues: {
      question: "",
      category: "" as QuestionCategory,
      source: "manual",
      customCategory: "",
    },
  });

  const selectedCategory = watch("category");

  const onSubmit = useCallback(
    handleSubmit(async (data: AddQuestionForm) => {
      const submissionData = {
        question: data.question,
        category:
          data.category === "background" && data.customCategory
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
    setShowConfirmation(false);
    onClose();
  }, [reset, onClose]);

  const handleGenerateClick = useCallback(() => {
    if (!selectedCategory) {
      addToast({
        title: "Please select a category first",
        color: "warning",
        timeout: 3000,
      });
      return;
    }
    setShowConfirmation(true);
  }, [selectedCategory]);

  const handleConfirmGenerate = useCallback(() => {
    if (!selectedCategory) return;

    generateAIQuestion(
      { category: selectedCategory },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setValue("question", response.data.question);
            setValue("category", response.data.category);
            setValue("source", "ai");
            setShowConfirmation(false);

            addToast({
              title: "AI question generated! You can now review and add it.",
              color: "success",
              timeout: 4000,
            });
          }
        },
        onError: (error: any) => {
          setShowConfirmation(false);
          addToast({
            title: error?.message || "Failed to generate AI question",
            color: "danger",
            timeout: 4000,
          });
        },
      }
    );
  }, [selectedCategory, generateAIQuestion, setValue]);

  if (showConfirmation) {
    return (
      <Modal
        open={open}
        title="Confirm Generation"
        onClose={() => setShowConfirmation(false)}
      >
        <div className="space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <p className="text-sm text-yellow-800">
              Are you sure you want to generate an AI question for the{" "}
              <strong>{selectedCategory}</strong> category?
            </p>
            <p className="text-sm text-yellow-800 mt-2">
              This will use AI to create a new interview question.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
              disabled={isGeneratingAI}
              type="button"
              onClick={() => setShowConfirmation(false)}
            >
              Cancel
            </button>
            <LoadingButton
              disabled={isGeneratingAI}
              loading={isGeneratingAI}
              type="button"
              onClick={handleConfirmGenerate}
            >
              Confirm & Generate
            </LoadingButton>
          </div>
        </div>
      </Modal>
    );
  }

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
            <option value="" disabled>
              -- Please select a category --
            </option>
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
          <button
            type="button"
            onClick={handleGenerateClick}
            disabled={isGeneratingAI || !selectedCategory}
            className="mt-3 w-full px-4 py-2 text-sm font-medium text-white  rounded-md  bg-[#11553F] hover:bg-[#0e4634] g focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGeneratingAI ? "Generating..." : "Generate Question with AI"}
          </button>
        </div>

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            disabled={isCreatingQuestion}
            type="button"
            onClick={handleClose}
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
