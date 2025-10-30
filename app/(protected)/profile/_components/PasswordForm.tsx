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

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Get form values and update password
    handleSubmit(async (data) => {
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
        register={register}
        name="currentPassword"
        placeholder="Current Password"
        type="password"
        error={errors.currentPassword?.message}
      />

      {/* New Password Field */}
      <FormInput
        register={register}
        name="newPassword"
        placeholder="New Password"
        type="password"
        error={errors.newPassword?.message}
      />

      {/* Confirm Password Field */}
      <FormInput
        register={register}
        name="confirmPassword"
        placeholder="Confirm Password"
        type="password"
        error={errors.confirmPassword?.message}
      />

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          className="bg-adult-green text-white hover:bg-adult-green/80 font-medium px-8"
          size="md"
          onClick={handleSaveClick}
        >
          SAVE
        </Button>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        open={showConfirmModal}
        title="Update Password"
        message="Are you sure you want to update your password? You will need to use the new password on your next login."
        confirmText="Update Password"
        cancelText="Cancel"
        isLoading={isSaving}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
