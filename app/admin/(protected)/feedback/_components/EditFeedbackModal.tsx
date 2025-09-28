"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import { Feedback, FeedbackType, FeedbackStatus, useFeedback } from "@/hooks/queries/admin/useFeedbackQueries";

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

const statusOptions = [
  { value: "pending", label: "Pending" },
  { value: "resolved", label: "Resolved" },
];

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
        // For now, we only support status updates from the backend
        // Title, description, type, and feature updates would need additional API endpoints

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
            }
          );
        } else {
          // No changes made
          addToast({
            title: "No changes to save",
            color: "warning",
            timeout: 3000,
          });
          onClose();
        }
      } catch (error) {
        console.error("Failed to update feedback:", error);
        addToast({
          title: "Failed to update feedback",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [feedback.id, feedback.status, updateFeedbackStatus, onFeedbackUpdated, onClose]
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            id="title"
            placeholder="Enter feedback title"
            type="text"
            disabled={true} // Read-only for now
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">
              {errors.title.message}
            </p>
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
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            id="description"
            placeholder="Enter feedback description"
            rows={4}
            disabled={true} // Read-only for now
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
            Type *
          </label>
          <select
            {...register("type", { required: "Type is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50 text-gray-500"
            id="type"
            disabled={true} // Read-only for now
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
          <p className="text-xs text-gray-500 mt-1">
            Type editing is currently view-only
          </p>
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="feature"
          >
            Feature *
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
            id="feature"
            placeholder="Enter related feature"
            type="text"
            disabled={true} // Read-only for now
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
            Status *
          </label>
          <select
            {...register("status", { required: "Status is required" })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="status"
            disabled={isLoading}
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          {errors.status && (
            <p className="mt-1 text-sm text-red-600">
              {errors.status.message}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            Update the feedback status
          </p>
        </div>

        <div className="bg-gray-50 p-3 rounded-lg">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Submitter Information</h4>
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Name:</strong> {feedback.submittedByName || "Unknown"}</p>
            <p><strong>Email:</strong> {feedback.submittedByEmail || "N/A"}</p>
            <p><strong>User ID:</strong> {feedback.submittedBy}</p>
            <p><strong>Created:</strong> {new Date(feedback.createdAt).toLocaleString()}</p>
            <p><strong>Updated:</strong> {new Date(feedback.updatedAt).toLocaleString()}</p>
          </div>
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
            disabled={isLoading || currentStatus === feedback.status}
            loading={isLoading}
          >
            {currentStatus === feedback.status ? "No Changes" : "Update Feedback"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}