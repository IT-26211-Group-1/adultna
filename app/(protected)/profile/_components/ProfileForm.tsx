"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { ProfilePicture } from "./ProfilePicture";
import { ConfirmationModal } from "./ConfirmationModal";
import { FormInput } from "@/app/auth/register/_components/FormInput";
import {
  profileUpdateSchema,
  ProfileUpdateInput,
} from "@/validators/profileSchema";
import { useState } from "react";

export function ProfileForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      displayName: "",
      firstName: "",
      lastName: "",
      email: "",
    },
  });

  const handleSaveClick = () => {
    handleSubmit(() => {
      setShowConfirmModal(true);
    })();
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    // Get form values
    handleSubmit(async (data) => {
      // Add your save logic here
      console.log("Saving profile:", data);

      setIsSaving(false);
      setShowConfirmModal(false);

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
      {/* Profile Picture */}
      <ProfilePicture />

      {/* Display Name Field */}
      <FormInput
        register={register}
        name="displayName"
        placeholder="Display Name"
        type="text"
        error={errors.displayName?.message}
      />

      {/* First Name Field */}
      <FormInput
        register={register}
        name="firstName"
        placeholder="First Name"
        type="text"
        error={errors.firstName?.message}
      />

      {/* Last Name Field */}
      <FormInput
        register={register}
        name="lastName"
        placeholder="Last Name"
        type="text"
        error={errors.lastName?.message}
      />

      {/* Email Field */}
      <FormInput
        register={register}
        name="email"
        placeholder="Email"
        type="email"
        error={errors.email?.message}
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
        title="Save Profile Changes"
        message="Are you sure you want to save these changes to your profile?"
        confirmText="Save Changes"
        cancelText="Cancel"
        isLoading={isSaving}
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
      />
    </div>
  );
}
