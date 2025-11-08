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
import { useState } from "react";

export function PasswordForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<PasswordUpdateInput>({
    resolver: zodResolver(passwordUpdateSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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

      // You can add a success toast notification here
    })();
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setShowConfirmModal(false);
    }
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

      {/* Confirmation Modal */}
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
    </div>
  );
}
