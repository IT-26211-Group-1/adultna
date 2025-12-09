"use client";

import React, { useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useOnboardingQuestions } from "@/hooks/queries/admin/useOnboardingQueries";
import { addOnboardingQuestionSchema, AddOnboardingQuestionForm } from "@/validators/onboardingSchema";
import {
  AddOnboardingQuestionModalProps,
} from "@/types/onboarding";

const categoryOptions = [
  { value: "life_stage", label: "Life Stage" },
  { value: "priorities", label: "Priorities" },
];

export default function AddOnboardingQuestionModal({
  open = false,
  onClose = () => {},
  onQuestionCreated,
}: AddOnboardingQuestionModalProps) {
  const { createQuestion, isCreating } = useOnboardingQuestions();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AddOnboardingQuestionForm>({
    resolver: zodResolver(addOnboardingQuestionSchema) as any,
    defaultValues: {
      question: "",
      category: "life_stage",
      options: [{ optionText: "", outcomeTagName: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  });

  const handleRemoveOption = useCallback(
    (index: number) => {
      if (fields.length > 1) {
        remove(index);
      }
    },
    [fields.length, remove],
  );

  const onSubmit = useCallback(
    async (data: AddOnboardingQuestionForm) => {
      try {
        createQuestion(data, {
          onSuccess: (response) => {
            if (response.success) {
              addToast({
                title: response.message || "Question created successfully",
                color: "success",
                timeout: 4000,
              });
              reset();
              onQuestionCreated?.();
              onClose();
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
      } catch {
        addToast({
          title: "Failed to create question",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [createQuestion, reset, onQuestionCreated, onClose],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const isLoading = isSubmitting || isCreating;

  return (
    <Modal open={open} title="Add Onboarding Question" onClose={handleClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="question"
          >
            Question <span className="text-red-500">*</span>
          </label>
          <input
            {...register("question")}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.question
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="question"
            placeholder="Enter question text"
            type="text"
            aria-invalid={errors.question ? "true" : "false"}
            aria-describedby={errors.question ? "question-error" : undefined}
          />
          {errors.question && (
            <p className="mt-1 text-sm text-red-600 flex items-center" id="question-error">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.question.message}
            </p>
          )}
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
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.category
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="category"
            aria-invalid={errors.category ? "true" : "false"}
            aria-describedby={errors.category ? "category-error" : undefined}
          >
            {categoryOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="mt-1 text-sm text-red-600 flex items-center" id="category-error">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.category.message}
            </p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="block text-sm font-medium text-gray-700">
              Answer Options <span className="text-red-500">*</span>
            </span>
            <button
              className="text-sm text-adult-green hover:text-adult-green/80 font-medium"
              disabled={isLoading}
              type="button"
              onClick={() => append({ optionText: "", outcomeTagName: "" })}
            >
              + Add Option
            </button>
          </div>
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border border-gray-200 rounded-md p-3"
              >
                <div className="flex gap-3">
                  <div className="flex-1 space-y-3">
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-600 mb-1"
                        htmlFor={`option-text-${index}`}
                      >
                        Option Text <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register(`options.${index}.optionText`)}
                        className={`block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors text-sm ${
                          errors.options?.[index]?.optionText
                            ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                            : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
                        }`}
                        disabled={isLoading}
                        id={`option-text-${index}`}
                        placeholder="e.g., 18-25"
                        type="text"
                        aria-invalid={errors.options?.[index]?.optionText ? "true" : "false"}
                        aria-describedby={errors.options?.[index]?.optionText ? `optionText-${index}-error` : undefined}
                      />
                      {errors.options?.[index]?.optionText && (
                        <p className="mt-1 text-xs text-red-600 flex items-center" id={`optionText-${index}-error`}>
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                          {errors.options[index]?.optionText?.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <label
                        className="block text-xs font-medium text-gray-600 mb-1"
                        htmlFor={`outcome-tag-${index}`}
                      >
                        Outcome Tag
                      </label>
                      <input
                        {...register(`options.${index}.outcomeTagName`)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                        disabled={isLoading}
                        id={`outcome-tag-${index}`}
                        placeholder="e.g., young_adult"
                        type="text"
                      />
                    </div>
                  </div>
                  {fields.length > 1 && (
                    <button
                      className="p-2 h-8 text-red-600 hover:text-red-800 hover:bg-red-50 rounded self-start"
                      disabled={isLoading}
                      title="Remove option"
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleRemoveOption(index);
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
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
            disabled={!isDirty || isLoading}
            loading={isLoading}
            type="submit"
          >
            Create Question
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
