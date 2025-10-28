"use client";

import React, { memo, useMemo, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import type {
  InterviewQuestion,
  QuestionCategory,
  QuestionSource,
} from "@/types/interview-question";

type EditQuestionForm = {
  question: string;
  category: QuestionCategory;
  industry: string;
  customIndustry?: string;
  source: QuestionSource;
};

type EditQuestionModalProps = {
  open: boolean;
  question: InterviewQuestion;
  onClose: () => void;
  onQuestionUpdated: () => void;
};

function EditQuestionModal({
  open,
  question,
  onClose,
  onQuestionUpdated,
}: EditQuestionModalProps) {
  const { updateQuestion, isUpdatingQuestion } = useInterviewQuestions();

  const categoryOptions: { value: QuestionCategory; label: string }[] = useMemo(
    () => [
      { value: "behavioral", label: "Behavioral" },
      { value: "technical", label: "Technical" },
      { value: "situational", label: "Situational" },
    ],
    []
  );

  const sourceOptions: { value: QuestionSource; label: string }[] = useMemo(
    () => [
      { value: "manual", label: "Manual" },
      { value: "ai", label: "AI Suggested" },
    ],
    []
  );

  const industryOptions = useMemo(
    () => [
      { value: "information_technology", label: "Information Technology" },
      { value: "arts_and_design", label: "Arts and Design" },
      { value: "business_and_management", label: "Business and Management" },
      { value: "communication", label: "Communication" },
      { value: "education", label: "Education" },
      { value: "tourism_and_hospitality", label: "Tourism and Hospitality" },
      { value: "general", label: "General" },
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
  } = useForm<EditQuestionForm>({
    defaultValues: {
      question: question.question,
      category: question.category,
      industry: question.industry || "",
      customIndustry: "",
      source: question.source,
    },
  });

  const selectedIndustry = watch("industry");

  // Reset form when question changes
  useEffect(() => {
    if (question) {
      // Check if industry is a predefined value or custom
      const isPredefined = industryOptions.some(
        (opt) => opt.value === question.industry
      );

      reset({
        question: question.question,
        category: question.category,
        industry: isPredefined ? question.industry || "" : "other",
        customIndustry: isPredefined ? "" : question.industry || "",
        source: question.source,
      });
    }
  }, [question, reset, industryOptions]);

  const onSubmit = useCallback(
    handleSubmit(async (data: EditQuestionForm) => {
      updateQuestion(
        {
          questionId: question.id,
          question: data.question,
          category: data.category,
          industry:
            data.industry === "other" && data.customIndustry
              ? data.customIndustry
              : data.industry,
          source: data.source,
        },
        {
          onSuccess: (response) => {
            if (response.success) {
              addToast({
                title: response.message || "Question updated successfully",
                color: "success",
                timeout: 4000,
              });
              onQuestionUpdated();
            }
          },
          onError: (error: any) => {
            addToast({
              title: error?.message || "Failed to update question",
              color: "danger",
              timeout: 4000,
            });
          },
        }
      );
    }),
    [updateQuestion, handleSubmit, question.id, onQuestionUpdated]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Modal open={open} title="Edit Question" onClose={handleClose}>
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

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="industry"
          >
            Industry *
          </label>
          <select
            {...register("industry", { required: "Industry is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="industry"
          >
            <option disabled value="">
              -- Please select an industry --
            </option>
            {industryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.industry && (
            <p className="mt-1 text-sm text-red-600">
              {errors.industry.message}
            </p>
          )}
        </div>

        {selectedIndustry === "other" && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="customIndustry"
            >
              Specify Industry *
            </label>
            <textarea
              {...register("customIndustry", {
                required:
                  selectedIndustry === "other"
                    ? "Please specify the industry"
                    : false,
                minLength: {
                  value: 3,
                  message: "Industry must be at least 3 characters",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              id="customIndustry"
              placeholder="Enter industry name"
              rows={2}
            />
            {errors.customIndustry && (
              <p className="mt-1 text-sm text-red-600">
                {errors.customIndustry.message}
              </p>
            )}
          </div>
        )}

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="source"
          >
            Source *
          </label>
          <select
            {...register("source", { required: "Source is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="source"
          >
            {sourceOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.source && (
            <p className="mt-1 text-sm text-red-600">{errors.source.message}</p>
          )}
        </div>

        {(question.status === "approved" || question.status === "rejected") && (
          <div className="bg-amber-50 border border-amber-200 rounded-md p-3">
            <p className="text-sm text-amber-800">
              <strong>Note:</strong> This question has status &quot;
              {question.status}
              &quot; and cannot be edited by technical admins. Only verifier
              admins can update the status.
            </p>
          </div>
        )}

        {(question.status === "pending" || question.status === "to_revise") && (
          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-800">
              <strong>Current Status:</strong>{" "}
              {question.status === "pending" ? "Pending" : "To Revise"}
              <br />
              Status can only be changed by verifier admins.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            disabled={isUpdatingQuestion}
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            disabled={isUpdatingQuestion}
            loading={isUpdatingQuestion}
            type="submit"
          >
            Update Question
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(EditQuestionModal);
