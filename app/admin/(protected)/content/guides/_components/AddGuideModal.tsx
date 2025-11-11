"use client";

import React, { memo, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import {
  addGuideSchema,
  AddGuideForm,
} from "@/validators/guideSchema";
import { addToast } from "@heroui/toast";

interface AddGuideModalProps {
  open?: boolean;
  onClose?: () => void;
}

function AddGuideModal({
  open = false,
  onClose = () => {},
}: AddGuideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    watch,
  } = useForm({
    resolver: zodResolver(addGuideSchema),
    defaultValues: {
      title: "",
      issuingAgency: "",
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
  } = useFieldArray({
    control,
    name: "steps",
  });

  const {
    fields: requirementFields,
    append: appendRequirement,
    remove: removeRequirement,
  } = useFieldArray({
    control,
    name: "requirements",
  });

  const onSubmit = useCallback(
    handleSubmit(async (data: AddGuideForm) => {
      setIsSubmitting(true);
      
      try {
        // TODO: Replace with actual API call
        console.log("Guide data:", data);
        
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        handleClose();
        addToast({
          title: "Guide created successfully",
          color: "success",
          timeout: 4000,
        });
      } catch (error: any) {
        addToast({
          title: error?.message || "Failed to create guide",
          color: "danger",
          timeout: 4000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }),
    [handleSubmit],
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

  return (
    <Modal open={open} title="Add New Guide" onClose={handleClose}>
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
                <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0 mt-1">
                  {index + 1}
                </div>
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
                  <div className="flex items-center justify-center w-8 h-8 bg-adult-green text-white rounded-full text-sm font-semibold flex-shrink-0">
                    {index + 1}
                  </div>
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
                <div className="flex gap-2">
                  <div className="w-8 flex-shrink-0"></div>
                  <textarea
                    {...register(`requirements.${index}.description`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                    placeholder="Optional description"
                    rows={1}
                  />
                </div>
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
            Create Guide
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(AddGuideModal);
