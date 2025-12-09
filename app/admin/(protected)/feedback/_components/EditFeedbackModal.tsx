"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import {
  Feedback,
  FeedbackType,
  FeedbackStatus,
  useFeedback,
} from "@/hooks/queries/admin/useFeedbackQueries";
import { editFeedbackSchema, EditFeedbackForm } from "@/validators/feedbackSchema";
import { logger } from "@/lib/logger";

interface EditFeedbackModalProps {
  open: boolean;
  feedback: Feedback;
  onClose: () => void;
  onFeedbackUpdated?: (feedback?: Feedback) => void;
}

interface EditFeedbackFormData {
  title: string;
  description: string;
  type: FeedbackType;
  feature: string;
  status: FeedbackStatus;
}

const feedbackTypeOptions = [
  { value: "bug", label: "Bug Report" },
  { value: "feature", label: "Feature Request" },
  { value: "improvement", label: "Improvement" },
  { value: "general", label: "General Feedback" },
];

const getStatusOptions = (currentStatus: FeedbackStatus) => {
  const allOptions = [
    { value: "pending", label: "Pending" },
    { value: "resolved", label: "Resolved" },
  ];

  // If feedback is already resolved, disable status
  if (currentStatus === "resolved") {
    return allOptions.filter((option) => option.value !== "pending");
  }

  return allOptions;
};

export default function EditFeedbackModal({
  open,
  feedback,
  onClose,
  onFeedbackUpdated,
}: EditFeedbackModalProps) {
  const { updateFeedbackStatus, isUpdatingStatus } = useFeedback();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditFeedbackFormData>({
    defaultValues: {
      title: feedback.title,
      description: feedback.description,
      type: feedback.type,
      feature: feedback.feature,
      status: feedback.status,
    },
  });

  const currentStatus = watch("status");

  const onSubmit = useCallback(
    async (data: EditFeedbackFormData) => {
      try {
        if (data.status !== feedback.status) {
          await updateFeedbackStatus(
            {
              feedbackId: feedback.id,
              status: data.status,
            },
            {
              onSuccess: (response) => {
                if (response.success) {
                  addToast({
                    title: response.message || "Feedback updated successfully",
                    color: "success",
                    timeout: 4000,
                  });
                  onFeedbackUpdated?.();
                }
              },
              onError: (error: any) => {
                addToast({
                  title: error?.message || "Failed to update feedback",
                  color: "danger",
                  timeout: 4000,
                });
              },
            },
          );
        } else {
          addToast({
            title: "No changes to save",
            color: "warning",
            timeout: 3000,
          });
          onClose();
        }
      } catch (error) {
        logger.error("Failed to update feedback:", error);
        addToast({
          title: "Failed to update feedback",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [
      feedback.id,
      feedback.status,
      updateFeedbackStatus,
      onFeedbackUpdated,
      onClose,
    ],
  );

  const handleClose = useCallback(() => {
    reset({
      title: feedback.title,
      description: feedback.description,
      type: feedback.type,
      feature: feedback.feature,
      status: feedback.status,
    });
    onClose();
  }, [reset, feedback, onClose]);

  const isLoading = isSubmitting || isUpdatingStatus;

  return (
    <Modal open={open} title="Edit Feedback" onClose={handleClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="title"
          >
            Title <span className="text-red-500">*</span>
          </label>
          <input
            {...register("title", {
              required: "Title is required",
              minLength: {
                value: 3,
                message: "Title must be at least 3 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            disabled={true}
            id="title"
            placeholder="Enter feedback title"
            type="text"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Title editing is currently view-only
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="description"
          >
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            {...register("description", {
              required: "Description is required",
              minLength: {
                value: 10,
                message: "Description must be at least 10 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            disabled={true}
            id="description"
            placeholder="Enter feedback description"
            rows={4}
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-600">
              {errors.description.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Description editing is currently view-only
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="type"
          >
            Type <span className="text-red-500">*</span>
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            disabled={true} // Read-only for now
            id="type"
          >
            {feedbackTypeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.type && (
            <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Type editing is currently view-only
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="feature"
          >
            Feature <span className="text-red-500">*</span>
          </label>
          <input
            {...register("feature", {
              required: "Feature is required",
              minLength: {
                value: 2,
                message: "Feature must be at least 2 characters",
              },
            })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            disabled={true} // Read-only for now
            id="feature"
            placeholder="Enter related feature"
            type="text"
          />
          {errors.feature && (
            <p className="mt-1 text-sm text-red-600">
              {errors.feature.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Feature editing is currently view-only
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="status"
          >
            Status <span className="text-red-500">*</span>
          </label>
          <select
            {...register("status", { required: "Status is required" })}
            className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
              errors.status
                ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
            }`}
            disabled={isLoading}
            id="status"
            aria-invalid={errors.status ? "true" : "false"}
            aria-describedby={errors.status ? "status-error" : undefined}
          >
            {getStatusOptions(feedback.status).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600 flex items-center" id="status-error">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {errors.status.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {feedback.status === "resolved"
              ? "Resolved feedback cannot be changed back to pending"
              : "Update the feedback status"}
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">
            Submitter Information
          </h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p>
              <strong>Name:</strong> {feedback.submittedByName || "Unknown"}
            </p>
            <p>
              <strong>Email:</strong> {feedback.submittedByEmail || "N/A"}
            </p>
            <p>
              <strong>User ID:</strong> {feedback.submittedBy}
            </p>
            <p>
              <strong>Created:</strong>{" "}
              {new Date(feedback.createdAt).toLocaleString()}
            </p>
            <p>
              <strong>Updated:</strong>{" "}
              {new Date(feedback.updatedAt).toLocaleString()}
            </p>
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
            disabled={isLoading || currentStatus === feedback.status}
            loading={isLoading}
            type="submit"
          >
            {currentStatus === feedback.status
              ? "No Changes"
              : "Update Feedback"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
