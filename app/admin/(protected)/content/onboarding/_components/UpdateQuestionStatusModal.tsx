"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addToast } from "@heroui/toast";
import {
  useOnboardingQuestions,
  QuestionStatus,
  OnboardingQuestion,
} from "@/hooks/queries/admin/useOnboardingQueries";

const statusOptions: { value: QuestionStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "to_revise", label: "To Revise" },
];

type UpdateStatusForm = {
  status: QuestionStatus;
  reason?: string;
};

type UpdateQuestionStatusModalProps = {
  open: boolean;
  question: OnboardingQuestion | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
};

export default function UpdateQuestionStatusModal({
  open = false,
  question,
  onClose = () => {},
  onStatusUpdated,
}: UpdateQuestionStatusModalProps) {
  const { updateQuestionStatus, isUpdatingStatus } = useOnboardingQuestions();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStatusForm>({
    defaultValues: {
      status: question?.status || "pending",
      reason: "",
    },
  });

  const currentStatus = watch("status");
  const requiresReason = currentStatus === "rejected" || currentStatus === "to_revise";

  const onSubmit = useCallback(
    async (data: UpdateStatusForm) => {
      if (!question) return;

      try {
        const hasChanges = data.status !== question.status;

        if (!hasChanges) {
          addToast({
            title: "No changes to save",
            color: "warning",
            timeout: 3000,
          });
          onClose();
          return;
        }

        // Validate reason for rejected/to_revise
        if (requiresReason && !data.reason?.trim()) {
          addToast({
            title: "Reason is required for this status",
            color: "danger",
            timeout: 3000,
          });
          return;
        }

        updateQuestionStatus(
          {
            questionId: question.id,
            status: data.status,
            reason: data.reason?.trim() || undefined,
          },
          {
            onSuccess: (response) => {
              if (response.success) {
                addToast({
                  title: response.message || "Status updated successfully",
                  color: "success",
                  timeout: 4000,
                });
                reset();
                onStatusUpdated?.();
                onClose();
              }
            },
            onError: (error: any) => {
              addToast({
                title: error?.message || "Failed to update status",
                color: "danger",
                timeout: 4000,
              });
            },
          }
        );
      } catch (error) {
        addToast({
          title: "Failed to update status",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [question, requiresReason, updateQuestionStatus, onStatusUpdated, onClose, reset]
  );

  const handleClose = useCallback(() => {
    reset({
      status: question?.status || "pending",
      reason: "",
    });
    onClose();
  }, [reset, question, onClose]);

  const isLoading = isSubmitting || isUpdatingStatus;

  const hasChanges = currentStatus !== question?.status;

  return (
    <Modal open={open} title="Update Question Status" onClose={handleClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {question && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Question
            </h4>
            <p className="text-sm text-gray-700">{question.question}</p>
          </div>
        )}

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
            disabled={isLoading}
            id="status"
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
        </div>

        {requiresReason && (
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="reason"
            >
              Reason *
            </label>
            <textarea
              {...register("reason", {
                required: requiresReason ? "Reason is required for this status" : false,
                minLength: {
                  value: 10,
                  message: "Reason must be at least 10 characters",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              disabled={isLoading}
              id="reason"
              placeholder="Enter the reason for this status change"
              rows={4}
            />
            {errors.reason && (
              <p className="mt-1 text-sm text-red-600">
                {errors.reason.message}
              </p>
            )}
          </div>
        )}

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
            disabled={isLoading || !hasChanges}
            loading={isLoading}
            type="submit"
          >
            {!hasChanges ? "No Changes" : "Update Status"}
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}
