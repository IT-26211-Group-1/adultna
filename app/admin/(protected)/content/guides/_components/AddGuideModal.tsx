"use client";

import React, { memo, useState, useCallback } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { addGuideSchema, AddGuideForm } from "@/validators/guideSchema";
import { addToast } from "@heroui/toast";
import { useGuidesQueries } from "@/hooks/queries/admin/useGuidesQueries";

interface AddGuideModalProps {
  open?: boolean;
  onClose?: () => void;
}

function AddGuideModal({
  open = false,
  onClose = () => {},
}: AddGuideModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createGuideAsync } = useGuidesQueries();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    control,
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(addGuideSchema),
    defaultValues: {
      title: "",
      issuingAgency: "",
      category: "" as any,
      customCategory: "",
      summary: "",
      estimatedProcessingTime: "",
      isFree: false,
      feeAmount: 0,
      feeCurrency: "PHP",
      oneTimeFee: true,
      steps: [{ stepNumber: 1, title: "" }],
      requirements: [
        {
          name: "",
          description: "",
        },
      ],
      generalTips: {
        tipsToFollow: [],
        tipsToAvoid: [],
        importantReminders: [],
      },
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

  const {
    fields: tipsToFollowFields,
    append: appendTipToFollow,
    remove: removeTipToFollow,
  } = useFieldArray({
    control,
    name: "generalTips.tipsToFollow" as any,
  });

  const {
    fields: tipsToAvoidFields,
    append: appendTipToAvoid,
    remove: removeTipToAvoid,
  } = useFieldArray({
    control,
    name: "generalTips.tipsToAvoid" as any,
  });

  const {
    fields: importantRemindersFields,
    append: appendImportantReminder,
    remove: removeImportantReminder,
  } = useFieldArray({
    control,
    name: "generalTips.importantReminders" as any,
  });

  const isFree = watch("isFree");

  React.useEffect(() => {
    if (isFree) {
      setValue("feeAmount", 0, { shouldDirty: true, shouldValidate: true });
    }
  }, [isFree, setValue]);

  const onSubmit = useCallback(
    handleSubmit(async (data: AddGuideForm) => {
      setIsSubmitting(true);

      try {
        // Map frontend data to backend API format
        const guideData = {
          title: data.title,
          category: data.category as any,
          customCategory:
            data.category === "other" ? data.customCategory : null,
          description: data.summary || "",
          keywords: [], // Can be added to form later
          steps: data.steps.map((step, index) => ({
            stepNumber: index + 1,
            title: step.title,
            description: "",
            estimatedTime: "",
          })),
          requirements: data.requirements.map((req) => ({
            name: req.name,
            description: req.description || "",
            isRequired: true,
          })),
          processingTime: data.estimatedProcessingTime || "",
          offices: {
            issuingAgency: data.issuingAgency,
            locations: [],
            feeAmount: data.isFree ? 0 : data.feeAmount,
            feeCurrency: data.feeCurrency || "PHP",
            oneTimeFee: data.oneTimeFee,
          },
          generalTips: data.generalTips,
        };

        const response = await createGuideAsync(guideData);

        if (response.success) {
          handleClose();
          addToast({
            title: "Guide created successfully",
            color: "success",
            timeout: 4000,
          });
        } else {
          throw new Error(response.message || "Failed to create guide");
        }
      } catch (error: any) {
        let errorMessage = error?.message || "Failed to create guide";

        if (
          errorMessage.includes("Duplicate entry") &&
          errorMessage.includes("slug_unique")
        ) {
          errorMessage = "Title is already taken";
        }

        addToast({
          title: errorMessage,
          color: "danger",
          timeout: 4000,
        });
      } finally {
        setIsSubmitting(false);
      }
    }),
    [handleSubmit, createGuideAsync],
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

  const handleAddTipToFollow = () => {
    appendTipToFollow("" as any);
  };

  const handleAddTipToAvoid = () => {
    appendTipToAvoid("" as any);
  };

  const handleAddImportantReminder = () => {
    appendImportantReminder("" as any);
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
              Guide Title <span className="text-red-500">*</span>
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
              id="title"
              placeholder="e.g., How to Apply for SSS Number"
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
              htmlFor="issuingAgency"
            >
              Issuing Agency <span className="text-red-500">*</span>
            </label>
            <input
              {...register("issuingAgency")}
              aria-describedby={
                errors.issuingAgency ? "issuingAgency-error" : undefined
              }
              aria-invalid={errors.issuingAgency ? "true" : "false"}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                errors.issuingAgency
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
              }`}
              id="issuingAgency"
              placeholder="e.g., SSS, PhilHealth, BIR"
              type="text"
            />
            {errors.issuingAgency && (
              <p
                className="mt-1 text-sm text-red-600 flex items-center"
                id="issuingAgency-error"
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
                {errors.issuingAgency.message}
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
              aria-describedby={errors.category ? "category-error" : undefined}
              aria-invalid={errors.category ? "true" : "false"}
              className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                errors.category
                  ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                  : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
              }`}
              id="category"
            >
              <option value="">Select a category</option>
              <option value="identification">Identification</option>
              <option value="civil-registration">Civil Registration</option>
              <option value="permits-licenses">Permits & Licenses</option>
              <option value="social-services">Social Services</option>
              <option value="tax-related">Tax Related</option>
              <option value="legal">Legal</option>
              <option value="other">Other</option>
            </select>
            {errors.category && (
              <p
                className="mt-1 text-sm text-red-600 flex items-center"
                id="category-error"
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
                {errors.category.message}
              </p>
            )}
          </div>

          {watch("category") === "other" && (
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="customCategory"
              >
                Custom Category <span className="text-red-500">*</span>
              </label>
              <input
                {...register("customCategory")}
                aria-describedby={
                  errors.customCategory ? "customCategory-error" : undefined
                }
                aria-invalid={errors.customCategory ? "true" : "false"}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
                  errors.customCategory
                    ? "border-red-300 focus:ring-red-500 focus:border-red-500 bg-red-50"
                    : "border-gray-300 focus:ring-adult-green focus:border-adult-green"
                }`}
                id="customCategory"
                placeholder="Enter custom category name"
                type="text"
              />
              {errors.customCategory && (
                <p
                  className="mt-1 text-sm text-red-600 flex items-center"
                  id="customCategory-error"
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
                  {errors.customCategory.message}
                </p>
              )}
            </div>
          )}

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
              <div className="block text-sm font-medium text-gray-700 mb-2">
                Processing Fee
              </div>
              <div className="flex items-center gap-2 mb-2">
                <input
                  {...register("isFree")}
                  className="h-4 w-4 text-adult-green focus:ring-adult-green border-gray-300 rounded"
                  id="isFree"
                  type="checkbox"
                />
                <label className="text-sm text-gray-700" htmlFor="isFree">
                  Free (No Fee)
                </label>
              </div>
              {!isFree && (
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
              )}
            </div>
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
                  <div className="w-8 flex-shrink-0" />
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

        {/* General Tips Section */}
        <div className="space-y-4 border-t pt-4">
          <h3 className="text-lg font-semibold text-gray-900">
            General Tips (Optional)
          </h3>

          {/* Tips to Follow */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Tips to Follow ({tipsToFollowFields.length})
              </h4>
              <button
                className="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700"
                type="button"
                onClick={handleAddTipToFollow}
              >
                + Add Tip
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tipsToFollowFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <span className="text-green-600 mt-2">✓</span>
                  <input
                    {...register(`generalTips.tipsToFollow.${index}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                    placeholder="e.g., Bring original documents"
                    type="text"
                  />
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    type="button"
                    onClick={() => removeTipToFollow(index)}
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              ))}
            </div>
          </div>

          {/* Tips to Avoid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Tips to Avoid ({tipsToAvoidFields.length})
              </h4>
              <button
                className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                type="button"
                onClick={handleAddTipToAvoid}
              >
                + Add Tip
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {tipsToAvoidFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <span className="text-red-600 mt-2">✗</span>
                  <input
                    {...register(`generalTips.tipsToAvoid.${index}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                    placeholder="e.g., Don't bring photocopies only"
                    type="text"
                  />
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    type="button"
                    onClick={() => removeTipToAvoid(index)}
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              ))}
            </div>
          </div>

          {/* Important Reminders */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700">
                Important Reminders ({importantRemindersFields.length})
              </h4>
              <button
                className="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                type="button"
                onClick={handleAddImportantReminder}
              >
                + Add Reminder
              </button>
            </div>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {importantRemindersFields.map((field, index) => (
                <div key={field.id} className="flex gap-2 items-start">
                  <span className="text-blue-600 mt-2">ℹ</span>
                  <input
                    {...register(`generalTips.importantReminders.${index}`)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green text-sm"
                    placeholder="e.g., Processing takes 2-3 weeks"
                    type="text"
                  />
                  <button
                    className="p-2 text-red-600 hover:bg-red-50 rounded-md"
                    type="button"
                    onClick={() => removeImportantReminder(index)}
                  >
                    <svg
                      className="w-5 h-5"
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
                </div>
              ))}
            </div>
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
