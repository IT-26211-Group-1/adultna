"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useFeedback } from "@/hooks/queries/admin/useFeedbackQueries";
import {
  addFeedbackSchema,
  AddFeedbackForm,
} from "@/validators/feedbackSchema";
import { logger } from "@/lib/logger";

interface AddFeedbackModalProps {
  open?: boolean;
  onClose?: () => void;
  onFeedbackCreated?: () => void;
}

const feedbackTypeOptions = [
  { value: "report", label: "Report" },
  { value: "feedback", label: "Feedback" },
];

const featureOptions = [
  { value: "govmap", label: "GovMap" },
  { value: "filebox", label: "FileBox" },
  { value: "process_guides", label: "Process Guides" },
  { value: "ai_gabay_agent", label: "AI Gabay Agent" },
  { value: "mock_interview_coach", label: "Mock Interview Coach" },
];

export default function AddFeedbackModal({
  open = false,
  onClose = () => {},
  onFeedbackCreated,
}: AddFeedbackModalProps) {
  const { createFeedback, isCreatingFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<AddFeedbackForm>({
    resolver: zodResolver(addFeedbackSchema),
    defaultValues: {
      type: "feedback",
      feature: "govmap",
      title: "",
      description: "",
    },
  });

  const onSubmit = useCallback(
    async (data: AddFeedbackForm) => {
      try {
        createFeedback(data, {
          onSuccess: (response) => {
            if (response.success) {
              addToast({
                title: response.message || "Feedback created successfully",
                color: "success",
                timeout: 4000,
              });
              reset();
              onFeedbackCreated?.();
              onClose();
            }
          },
          onError: (error: any) => {
            addToast({
              title: error?.message || "Failed to create feedback",
              color: "danger",
              timeout: 4000,
            });
          },
        });
      } catch (error) {
        logger.error("Failed to create feedback:", error);
        addToast({
          title: "Failed to create feedback",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [createFeedback, reset, onFeedbackCreated, onClose],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const isLoading = isSubmitting || isCreatingFeedback;

  return (
    <Modal open={open} title="Add Feedback" onClose={handleClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="title"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title")}
            aria-describedby={errors.title ? "title-error" : undefined}
            aria-invalid={errors.title ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.title
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="title"
            placeholder="Enter feedback title"
            type="text"
          />
          {errors.title && (
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="title-error"
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
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description")}
            aria-describedby={
              errors.description ? "description-error" : undefined
            }
            aria-invalid={errors.description ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.description
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="description"
            placeholder="Enter detailed feedback description"
            rows={4}
          />
          {errors.description && (
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="description-error"
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
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="type"
          >
            Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type")}
            aria-describedby={errors.type ? "type-error" : undefined}
            aria-invalid={errors.type ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.type
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="type"
          >
            {feedbackTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="type-error"
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
              {errors.type.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="feature"
          >
            Related Feature <span className="text-red-500">*</span>
          </label>
          <select
            {...register("feature")}
            aria-describedby={errors.feature ? "feature-error" : undefined}
            aria-invalid={errors.feature ? "true" : "false"}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.feature
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="feature"
          >
            {featureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.feature && (
            <p
              className="mt-1 text-sm text-red-600 flex items-center"
              id="feature-error"
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
              {errors.feature.message}
            </p>
          )}
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
            Create Feedback
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
