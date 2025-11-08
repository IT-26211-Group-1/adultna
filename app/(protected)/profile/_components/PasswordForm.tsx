"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { ConfirmationModal } from "./ConfirmationModal";
import { FormInput } from "@/app/auth/register/_components/FormInput";
import {
  passwordUpdateSchema,
  PasswordUpdateInput,
} from "@/validators/profileSchema";
import { useState, useEffect, useCallback } from "react";

export function PasswordForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
    watch,
  } = useForm<PasswordUpdateInput>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const formValues = watch();

  // Track changes in form values
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Handle beforeunload event to warn about unsaved changes
  const handleBeforeUnload = useCallback((e: BeforeUnloadEvent) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = "";
      return "";
    }
  }, [hasUnsavedChanges]);

  useEffect(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [handleBeforeUnload]);

  const handleSaveClick = () => {
    handleSubmit(() => {
      setShowConfirmModal(true);
    })();
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);

    // Get form values and update password
    handleSubmit(async () => {
      // Add your password update logic here
      console.log("Updating password");

      setIsSaving(false);
      setShowConfirmModal(false);

      // Clear form after successful update
      reset();
      setHasUnsavedChanges(false);

      // You can add a success toast notification here
    })();
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setShowConfirmModal(false);
    }
  };

  const handleRefreshConfirm = () => {
    setHasUnsavedChanges(false);
    setShowRefreshModal(false);
    window.location.reload();
  };

  const handleRefreshCancel = () => {
    setShowRefreshModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Current Password Field */}
      <FormInput
        error={errors.currentPassword?.message}
        name="currentPassword"
        placeholder="Current Password"
        register={register}
        type="password"
      />

      {/* New Password and Confirm Password Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          error={errors.newPassword?.message}
          name="newPassword"
          placeholder="New Password"
          register={register}
          type="password"
        />
        <FormInput
          error={errors.confirmPassword?.message}
          name="confirmPassword"
          placeholder="Confirm Password"
          register={register}
          type="password"
        />
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-adult-green hover:bg-adult-green/90 text-white font-semibold px-8 py-3 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-0"
          size="md"
          onClick={handleSaveClick}
        >
          Save Changes
        </Button>
      </div>

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Update Password"
        isLoading={isSaving}
        message="Are you sure you want to update your password? You will need to use the new password on your next login."
        open={showConfirmModal}
        title="Update Password"
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
      />

      {/* Refresh Warning Modal */}
      <ConfirmationModal
        cancelText="Stay"
        confirmText="Leave Page"
        isLoading={false}
        message="You have unsaved changes. Your password details will be deleted if you proceed. Are you sure you want to leave this page?"
        open={showRefreshModal}
        title="Unsaved Changes"
        onClose={handleRefreshCancel}
        onConfirm={handleRefreshConfirm}
      />
    </div>
  );
}
