"use client";

import React, { memo, useState, useCallback, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import {
  addGuideSchema,
  AddGuideForm,
  categoryLabels,
} from "@/validators/guideSchema";
import { addToast } from "@heroui/toast";
import type { GovGuide } from "@/types/govguide";

interface EditGuideModalProps {
  open?: boolean;
  onClose?: () => void;
  guide: GovGuide | null;
  onGuideUpdated?: () => void;
}

function EditGuideModal({
  open = false,
  onClose = () => {},
  guide,
  onGuideUpdated,
}: EditGuideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    setValue,
  } = useForm({
    resolver: zodResolver(addGuideSchema),
    defaultValues: {
      title: "",
      issuingAgency: "",
      category: "ID" as const,
      summary: "",
      estimatedProcessingTime: "",
      feeAmount: null,
      feeCurrency: "PHP",
      status: "review" as const,
      steps: [{ stepNumber: 1, title: "" }],
      requirements: [
        {
          name: "",
          description: "",
        },
      ],
    },
  });

  const {
    fields: stepFields,
    append: appendStep,
    remove: removeStep,
    replace: replaceSteps,
  } = useFieldArray({
    control,
    name: "steps",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
    replace: replaceRequirements,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  // Populate form when guide changes
  useEffect(() => {
    if (guide && open) {
      // TODO: Fetch full guide details with steps and requirements from API
      // For now, using mock data structure
      setValue("title", guide.title);
      setValue("issuingAgency", guide.issuingAgency);
      setValue("category", guide.category);
      setValue("summary", guide.summary || "");
      setValue("estimatedProcessingTime", guide.estimatedProcessingTime || "");
      setValue("feeAmount", guide.feeAmount);
      setValue("feeCurrency", guide.feeCurrency);
      setValue("status", guide.status);

      // TODO: Replace with actual steps from API
      // Mock steps data
      replaceSteps([
        { stepNumber: 1, title: "Step 1 placeholder" },
        { stepNumber: 2, title: "Step 2 placeholder" },
      ]);

      // TODO: Replace with actual requirements from API
      // Mock requirements data
      replaceRequirements([
        {
          name: "Requirement 1",
          description: "Description 1",
        },
      ]);
    }
  }, [guide, open, setValue, replaceSteps, replaceRequirements]);

  const onSubmit = useCallback(
    handleSubmit(async (data: AddGuideForm) => {
      if (!guide) return;

      setIsSubmitting(true);

      try {
        // TODO: Replace with actual API call
        console.log("Update guide:", guide.id, data);

        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));

        handleClose();
        if (onGuideUpdated) {
          onGuideUpdated();
        }
        addToast({
          title: "Guide updated successfully",
          color: "success",
          timeout: 4000,
        });
      } catch (error: any) {
        addToast({
          title: error?.message || "Failed to update guide",
          color: "danger",
          timeout: 4000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }),
    [handleSubmit, guide, onGuideUpdated],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  const handleAddStep = () => {
    appendStep({ stepNumber: stepFields.length + 1, title: "" });
  };

  const handleAddRequirement = () => {
    appendRequirement({
      name: "",
      description: "",
    });
  };

  if (!guide) return null;

  return (
    <Modal open={open} title="Edit Guide" onClose={handleClose}>
      <form className="space-y-6" onSubmit={onSubmit}>
        {/* Basic Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Basic Information
          </h3>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="title"
            >
              Guide Title *
            </label>
            <input
              {...register("title")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              id="title"
              placeholder="e.g., How to Apply for SSS Number"
              type="text"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="issuingAgency"
              >
                Issuing Agency *
              </label>
              <input
                {...register("issuingAgency")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
                id="issuingAgency"
                placeholder="e.g., SSS, PhilHealth, BIR"
                type="text"
              />
              {errors.issuingAgency && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.issuingAgency.message}
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
                {...register("category")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
                id="category"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.category.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="summary"
            >
              Summary
            </label>
            <textarea
              {...register("summary")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              id="summary"
              placeholder="Brief description of the guide"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="estimatedProcessingTime"
              >
                Processing Time
              </label>
              <input
                {...register("estimatedProcessingTime")}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
                id="estimatedProcessingTime"
                placeholder="e.g., 2-3 weeks"
                type="text"
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="feeAmount"
              >
                Fee Amount (PHP)
              </label>
              <input
                {...register("feeAmount", {
                  setValueAs: (v) => (v === "" ? null : parseFloat(v)),
                })}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
                id="feeAmount"
                placeholder="0.00"
                step="0.01"
                type="number"
              />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="status"
            >
              Status
            </label>
            <select
              {...register("status")}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
              id="status"
            >
              <option value="review">Review</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        {/* Steps Section */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Steps ({stepFields.length})
            </h3>
            <button
              className="px-3 py-1 text-sm bg-adult-green text-white rounded-md hover:bg-adult-green/90"
              type="button"
              onClick={handleAddStep}
            >
              + Add Step
            </button>
          </div>
          {errors.steps && (
            <p className="text-sm text-red-600">{errors.steps.message}</p>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {stepFields.map((field, index) => (
              <div
                key={field.id}
                className="flex gap-2 items-start p-3 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <input
                    {...register(`steps.${index}.title`)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                    placeholder={`Step ${index + 1} title`}
                    type="text"
                  />
                  {errors.steps?.[index]?.title && (
                    <p className="mt-1 text-xs text-red-600">
                      {errors.steps[index]?.title?.message}
                    </p>
                  )}
                </div>
                {stepFields.length > 1 && (
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    type="button"
                    onClick={() => removeStep(index)}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Requirements Section */}
        <div className="space-y-4 border-t pt-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Requirements ({requirementFields.length})
            </h3>
            <button
              className="px-3 py-1 text-sm bg-adult-green text-white rounded-md hover:bg-adult-green/90"
              type="button"
              onClick={handleAddRequirement}
            >
              + Add Requirement
            </button>
          </div>
          {errors.requirements && (
            <p className="text-sm text-red-600">
              {errors.requirements.message}
            </p>
          )}

          <div className="space-y-3 max-h-60 overflow-y-auto">
            {requirementFields.map((field, index) => (
              <div
                key={field.id}
                className="p-3 bg-gray-50 rounded-md space-y-2"
              >
                <div className="flex gap-2 items-start">
                  <div className="flex-1">
                    <input
                      {...register(`requirements.${index}.name`)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                      placeholder="Requirement name (e.g., Valid ID)"
                      type="text"
                    />
                    {errors.requirements?.[index]?.name && (
                      <p className="mt-1 text-xs text-red-600">
                        {errors.requirements[index]?.name?.message}
                      </p>
                    )}
                  </div>
                  {requirementFields.length > 1 && (
                    <button
                      className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                      type="button"
                      onClick={() => removeRequirement(index)}
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                        />
                      </svg>
                    </button>
                  )}
                </div>
                <textarea
                  {...register(`requirements.${index}.description`)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                  placeholder="Optional description"
                  rows={1}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
            disabled={!isDirty}
            loading={isSubmitting}
            type="submit"
          >
            Update Guide
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(EditGuideModal);
