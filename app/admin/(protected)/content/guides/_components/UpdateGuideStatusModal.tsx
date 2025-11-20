"use client";

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { WordCount } from "@/components/ui/WordCount";
import { addToast } from "@heroui/toast";
import type { GovGuide, GuideStatus } from "@/types/govguide";
import { useGuidesQueries } from "@/hooks/queries/admin/useGuidesQueries";

const statusOptions: { value: GuideStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "accepted", label: "Accepted" },
  { value: "rejected", label: "Rejected" },
  { value: "to_revise", label: "To Revise" },
];

type UpdateStatusForm = {
  status: GuideStatus;
  reason?: string;
};

type UpdateGuideStatusModalProps = {
  open: boolean;
  guide: GovGuide | null;
  onClose: () => void;
  onStatusUpdated?: () => void;
};

export default function UpdateGuideStatusModal({
  open = false,
  guide,
  onClose = () => {},
  onStatusUpdated,
}: UpdateGuideStatusModalProps) {
  const { verifyGuide, isVerifyingGuide } = useGuidesQueries();

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateStatusForm>({
    defaultValues: {
      status: guide?.status || "pending",
      reason: "",
    },
  });

  const currentStatus = watch("status");
  const reasonValue = watch("reason");
  const requiresReason =
    currentStatus === "rejected" || currentStatus === "to_revise";

  const onSubmit = useCallback(
    async (data: UpdateStatusForm) => {
      if (!guide) return;

      try {
        const hasChanges = data.status !== guide.status;

        if (!hasChanges) {
          addToast({
            title: "No changes to save",
            color: "warning",
            timeout: 3000,
          });
          onClose();

          return;
        }

        let action: "approve" | "reject" | "revise";

        if (data.status === "accepted") {
          action = "approve";
        } else if (data.status === "rejected") {
          action = "reject";
        } else {
          action = "revise";
        }

        verifyGuide(
          {
            guideId: guide.id,
            data: {
              action,
              reason: data.reason?.trim(),
            },
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
          },
        );
      } catch {
        addToast({
          title: "Failed to update status",
          color: "danger",
          timeout: 4000,
        });
      }
    },
    [guide, verifyGuide, onStatusUpdated, onClose, reset],
  );

  const handleClose = useCallback(() => {
    reset({
      status: guide?.status || "pending",
    });
    onClose();
  }, [reset, guide, onClose]);

  const isLoading = isSubmitting || isVerifyingGuide;

  const hasChanges = currentStatus !== guide?.status;

  return (
    <Modal open={open} title="Update Guide Status" onClose={handleClose}>
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        {guide && (
          <div className="bg-gray-50 p-3 rounded-lg mb-4">
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              Guide Title
            </h4>
            <p className="text-sm text-gray-700">{guide.title}</p>
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
            <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
          )}
        </div>

        {requiresReason && (
          <div>
            <div className="flex justify-between items-center mb-1">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="reason"
              >
                Reason *
              </label>
              <WordCount maxCount={500} text={reasonValue} type="characters" />
            </div>
            <textarea
              {...register("reason", {
                required: requiresReason
                  ? "Reason is required for rejected or to revise status"
                  : false,
                maxLength: {
                  value: 500,
                  message: "Reason must not exceed 500 characters",
                },
              })}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              disabled={isLoading}
              id="reason"
              maxLength={500}
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
