"use client";

import React, { memo, useMemo, useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import type { QuestionCategory } from "@/types/interview-question";

type GenerateAIQuestionForm = {
  category: QuestionCategory;
  industry: string;
  customIndustry?: string;
  customCategory?: string;
};

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
    null
  );

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
      { value: "education", label: "Education" },
      { value: "tourism_and_hospitality", label: "Tourism and Hospitality" },
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
  } = useForm<GenerateAIQuestionForm>({
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
    [handleSubmit]
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

        {selectedCategory === "background" && (
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
                  selectedCategory === "background"
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
            disabled={isGeneratingAI}
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            disabled={isGeneratingAI}
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
