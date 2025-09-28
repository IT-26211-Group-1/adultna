"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { useFeedback, CreateFeedbackRequest } from "@/hooks/queries/admin/useFeedbackQueries";

interface AddFeedbackModalProps {
  open: boolean;
  onClose: () => void;
  onFeedbackCreated?: () => void;
}

interface AddFeedbackFormData extends CreateFeedbackRequest {}

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
  open,
  onClose,
  onFeedbackCreated,
}: AddFeedbackModalProps) {
  const { createFeedback, isCreatingFeedback } = useFeedback();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddFeedbackFormData>({
    defaultValues: {
      type: "feedback",
      feature: "govmap",
      title: "",
      description: "",
    },
  });

  const onSubmit = useCallback(
    async (data: AddFeedbackFormData) => {
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
        console.error("Failed to create feedback:", error);
        addToast({
          title: "Failed to create feedback",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [createFeedback, reset, onFeedbackCreated, onClose]
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const isLoading = isSubmitting || isCreatingFeedback;

  return (
    <Modal open={open} title="Add Feedback" onClose={handleClose}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="title"
          >
            Title *
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="title"
            placeholder="Enter feedback title"
            type="text"
            disabled={isLoading}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.title.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description *
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="description"
            placeholder="Enter detailed feedback description"
            rows={4}
            disabled={isLoading}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="type"
          >
            Type *
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="type"
            disabled={isLoading}
          >
            {feedbackTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">
              {errors.type.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="feature"
          >
            Related Feature *
          </label>
          <select
            {...register("feature", { required: "Feature is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="feature"
            disabled={isLoading}
          >
            {featureOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.feature && (
            <p className="mt-1 text-sm text-red-600">
              {errors.feature.message}
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green"
            onClick={handleClose}
            disabled={isLoading}
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            disabled={isLoading}
            loading={isLoading}
          >
            Create Feedback
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
