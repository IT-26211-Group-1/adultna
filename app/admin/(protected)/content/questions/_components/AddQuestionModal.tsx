"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import type {
  QuestionCategory,
  QuestionSource,
} from "@/types/interview-question";

type JobRoleField = {
  jobRoleTitle: string;
};

type AddQuestionForm = {
  question: string;
  category: QuestionCategory;
  industry: string;
  customIndustry?: string;
  source: QuestionSource;
  customCategory?: string;
  jobRoles: JobRoleField[];
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
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  const categoryOptions: { value: QuestionCategory; label: string }[] = useMemo(
    () => [
      { value: "behavioral", label: "Behavioral" },
      { value: "technical", label: "Technical" },
      { value: "situational", label: "Situational" },
      { value: "background", label: "Background" },
    ],
    []
  );

  const industryOptions = useMemo(
    () => [
      { value: "information_technology", label: "Information Technology" },
      { value: "arts_and_design", label: "Arts and Design" },
      { value: "business_and_management", label: "Business and Management" },
      { value: "communication", label: "Communication" },
      { value: "tourism_and_hospitality", label: "Tourism and Hospitality" },
      { value: "education", label: "Education" },
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
    setValue,
    watch,
    control,
  } = useForm<AddQuestionForm>({
    defaultValues: {
      question: "",
      category: "" as QuestionCategory,
      industry: "",
      customIndustry: "",
      source: "manual",
      customCategory: "",
      jobRoles: [{ jobRoleTitle: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "jobRoles",
  });

  const selectedCategory = watch("category");
  const selectedIndustry = watch("industry");

  const handleRemoveJobRole = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove]
  );

  const onSubmit = useCallback(
    handleSubmit(async (data: AddQuestionForm) => {
      const jobRoles = data.jobRoles
        ?.map((role) => role.jobRoleTitle.trim())
        .filter((title) => title !== "") || [];

      const submissionData = {
        question: data.question,
        category: data.category,
        industry:
          data.industry === "other" && data.customIndustry
            ? data.customIndustry
            : data.industry || undefined,
        jobRoles: jobRoles.length > 0 ? jobRoles : undefined,
        source: isAIGenerated
          ? ("ai" as QuestionSource)
          : ("manual" as QuestionSource),
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
    [createQuestion, handleSubmit, isAIGenerated]
  );

  const handleClose = useCallback(() => {
    reset();
    setShowConfirmation(false);
    setIsAIGenerated(false);
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

    const industryValue =
      selectedIndustry === "other" ? watch("customIndustry") : selectedIndustry;

    generateAIQuestion(
      {
        category: selectedCategory,
        industry: industryValue,
      },
      {
        onSuccess: (response) => {
          if (response.success && response.data) {
            setValue("question", response.data.question);
            setValue("category", response.data.category);
            setIsAIGenerated(true);
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
  }, [selectedCategory, selectedIndustry, generateAIQuestion, setValue, watch]);

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
            <option disabled value="">
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
          <div className="flex justify-between items-center mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Job Roles
            </span>
            <button
              className="text-sm text-adult-green hover:text-adult-green/80 font-medium"
              disabled={isCreatingQuestion}
              type="button"
              onClick={() => append({ jobRoleTitle: "" })}
            >
              + Add Job Role
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-md p-3"
              >
                <div className="flex gap-3">
                  <div className="flex-1">
                    <label
                      className="block text-xs font-medium text-gray-600 mb-1"
                      htmlFor={`job-role-${index}`}
                    >
                      Job Role Title
                    </label>
                    <input
                      {...register(`jobRoles.${index}.jobRoleTitle`)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                      disabled={isCreatingQuestion}
                      id={`job-role-${index}`}
                      placeholder="e.g., Software Engineer"
                      type="text"
                    />
                    {errors.jobRoles?.[index]?.jobRoleTitle && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.jobRoles[index]?.jobRoleTitle?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <button
                      className="p-2 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded self-start mt-6"
                      disabled={isCreatingQuestion}
                      title="Remove job role"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveJobRole(index);
                      }}
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M6 18L18 6M6 6l12 12"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          className="w-full px-4 py-2 text-sm font-medium text-white rounded-md bg-[#11553F] hover:bg-[#0e4634] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isGeneratingAI || !selectedCategory || !selectedIndustry}
          type="button"
          onClick={handleGenerateClick}
        >
          {isGeneratingAI ? "Generating..." : "Generate Question with AI"}
        </button>

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
