"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import {
  generateAIQuestionSchema,
  GenerateAIQuestionForm,
} from "@/validators/questionSchema";
import type { QuestionCategory } from "@/types/interview-question";

type GenerateAIQuestionModalProps = {
  open?: boolean;
  onClose?: () => void;
  onQuestionGenerated?: (question: string, category: QuestionCategory) => void;
};

function GenerateAIQuestionModal({
  open = false,
  onClose = () => {},
  onQuestionGenerated,
}: GenerateAIQuestionModalProps) {
  const { generateAIQuestion, isGeneratingAI } = useInterviewQuestions();
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingData, setPendingData] = useState<GenerateAIQuestionForm | null>(
    null,
  );

  const categoryOptions: { value: QuestionCategory; label: string }[] = useMemo(
    () => [
      { value: "behavioral", label: "Behavioral" },
      { value: "technical", label: "Technical" },
      { value: "situational", label: "Situational" },
      { value: "background", label: "Background" },
    ],
    [],
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
    [],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<GenerateAIQuestionForm>({
    resolver: zodResolver(generateAIQuestionSchema),
    defaultValues: {
      category: "background",
      industry: "",
      customIndustry: "",
    },
  });

  const selectedCategory = watch("category");
  const selectedIndustry = watch("industry");

  const handleClose = useCallback(() => {
    reset();
    setShowConfirmation(false);
    setPendingData(null);
    onClose();
  }, [reset, onClose]);

  const onSubmit = useCallback(
    handleSubmit((data: GenerateAIQuestionForm) => {
      setPendingData(data);
      setShowConfirmation(true);
    }),
    [handleSubmit],
  );

  const handleConfirmGenerate = useCallback(() => {
    if (!pendingData) return;

    const submissionData = {
      category:
        pendingData.category === "background" && pendingData.customCategory
          ? (pendingData.customCategory as QuestionCategory)
          : pendingData.category,
      industry:
        pendingData.industry === "other" && pendingData.customIndustry
          ? pendingData.customIndustry
          : pendingData.industry,
    };

    generateAIQuestion(submissionData, {
      onSuccess: (response) => {
        if (response.success && response.data) {
          setShowConfirmation(false);
          setPendingData(null);

          if (onQuestionGenerated) {
            // Fill the form with generated question
            onQuestionGenerated(response.data.question, response.data.category);
            handleClose();

            addToast({
              title: "AI question generated! You can now review and add it.",
              color: "success",
              timeout: 4000,
            });
          } else {
            // Fallback to old behavior if no callback
            handleClose();
            addToast({
              title:
                response.message ||
                "AI question generated successfully and pending review",
              color: "success",
              timeout: 4000,
            });
          }
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
    });
  }, [pendingData, generateAIQuestion, onQuestionGenerated, handleClose]);

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
              <strong>{(pendingData?.industry, pendingData?.category)}</strong>{" "}
              category?
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
    <Modal open={open} title="Generate AI Question" onClose={handleClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mb-4">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> The AI will generate one interview question
            based on the selected category. The generated question will have
            status &quot;pending&quot; and require review before approval.
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="category"
          >
            Category <span className="text-red-500">*</span>
          </label>
          <select
            {...register("category")}
            aria-describedby={errors.category ? "category-error" : undefined}
            aria-invalid={errors.category ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.category
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
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
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="category-error"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  fillRule="evenodd"
                />
              </svg>
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="industry"
          >
            Industry <span className="text-red-500">*</span>
          </label>
          <select
            {...register("industry")}
            aria-describedby={errors.industry ? "industry-error" : undefined}
            aria-invalid={errors.industry ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.industry
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
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
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="industry-error"
            >
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  clipRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  fillRule="evenodd"
                />
              </svg>
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
              Specify Industry <span className="text-red-500">*</span>
            </label>
            <textarea
              {...register("customIndustry")}
              aria-describedby={
                errors.customIndustry ? "customIndustry-error" : undefined
              }
              aria-invalid={errors.customIndustry ? "true" : "false"}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                errors.customIndustry
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
              }`}
              id="customIndustry"
              placeholder="Enter industry name"
              rows={2}
            />
            {errors.customIndustry && (
              <p
                className="mt-1 text-sm text-red-600 flex items-center"
                id="customIndustry-error"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    fillRule="evenodd"
                  />
                </svg>
                {errors.customIndustry.message}
              </p>
            )}
          </div>
        )}

        {selectedCategory === "background" && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="customCategory"
            >
              Please specify the category{" "}
              <span className="text-red-500">*</span>
            </label>
            <input
              {...register("customCategory")}
              aria-describedby={
                errors.customCategory ? "customCategory-error" : undefined
              }
              aria-invalid={errors.customCategory ? "true" : "false"}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                errors.customCategory
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
              }`}
              id="customCategory"
              placeholder="Enter custom category"
              type="text"
            />
            {errors.customCategory && (
              <p
                className="mt-1 text-sm text-red-600 flex items-center"
                id="customCategory-error"
              >
                <svg
                  className="w-4 h-4 mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    fillRule="evenodd"
                  />
                </svg>
                {errors.customCategory.message}
              </p>
            )}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            disabled={isGeneratingAI}
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
            disabled={!isDirty || isGeneratingAI}
            loading={isGeneratingAI}
            type="submit"
          >
            Generate AI Question
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(GenerateAIQuestionModal);
