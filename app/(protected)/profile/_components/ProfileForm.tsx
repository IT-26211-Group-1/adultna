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
import { useState, useEffect, useCallback } from "react";

export function ProfileForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
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

  const formValues = watch();

  // Track changes in form values and profile picture
  useEffect(() => {
    const hasChanges = isDirty || profilePictureChanged;
    setHasUnsavedChanges(hasChanges);
  }, [isDirty, profilePictureChanged]);

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
    // Get form values
    handleSubmit(async (data) => {
      // Add your save logic here
      console.log("Saving profile:", data);

      setIsSaving(false);
      setShowConfirmModal(false);
      setProfilePictureChanged(false);
      reset(data); // Reset form to mark as not dirty
      setHasUnsavedChanges(false);

      // You can add a success toast notification here
    })();
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setShowConfirmModal(false);
    }
  };

  const handleProfilePictureChange = useCallback(() => {
    setProfilePictureChanged(true);
  }, []);

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
      {/* Profile Picture */}
      <ProfilePicture onImageChange={handleProfilePictureChange} />

      {/* Display Name Field */}
      <FormInput
        error={errors.displayName?.message}
        name="displayName"
        placeholder="Display Name"
        register={register}
        type="text"
      />

      {/* First Name Field */}
      <FormInput
        error={errors.firstName?.message}
        name="firstName"
        placeholder="First Name"
        register={register}
        type="text"
      />

      {/* Last Name Field */}
      <FormInput
        error={errors.lastName?.message}
        name="lastName"
        placeholder="Last Name"
        register={register}
        type="text"
      />

      {/* Email Field */}
      <FormInput
        disabled
        error={errors.email?.message}
        name="email"
        placeholder="Email"
        register={register}
        type="email"
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

      {/* Save Confirmation Modal */}
      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Save Changes"
        isLoading={isSaving}
        message="Are you sure you want to save these changes to your profile?"
        open={showConfirmModal}
        title="Save Profile Changes"
        onClose={handleCloseModal}
        onConfirm={handleConfirmSave}
      />

      {/* Refresh Warning Modal */}
      <ConfirmationModal
        cancelText="Stay"
        confirmText="Leave Page"
        isLoading={false}
        message="You have unsaved changes. Your details will be deleted if you proceed. Are you sure you want to leave this page?"
        open={showRefreshModal}
        title="Unsaved Changes"
        onClose={handleRefreshCancel}
        onConfirm={handleRefreshConfirm}
      />
    </div>
  );
}
