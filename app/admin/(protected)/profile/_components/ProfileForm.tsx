"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import { ConfirmationModal } from "./ConfirmationModal";
import { FormInput } from "@/app/auth/register/_components/FormInput";
import {
  profileUpdateSchema,
  ProfileUpdateInput,
} from "@/validators/profileSchema";
import { useState, useEffect, useCallback } from "react";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import { useUpdateProfile } from "@/hooks/queries/useProfileQueries";
import { logger } from "@/lib/logger";

export function ProfileForm() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { user } = useAdminAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
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

  useEffect(() => {
    if (user) {
      reset({
        displayName: "", // Admin doesn't use displayName
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // Track changes in form values
  useEffect(() => {
    setHasUnsavedChanges(isDirty);
  }, [isDirty]);

  // Handle beforeunload event to warn about unsaved changes
  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";

        return "";
      }
    },
    [hasUnsavedChanges],
  );

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
    handleSubmit(async (data) => {
      try {
        await updateProfile.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
        });

        setShowConfirmModal(false);
        reset(data);
        setHasUnsavedChanges(false);
      } catch (error) {
        logger.error("Failed to update profile:", error);
      } finally {
        setIsSaving(false);
      }
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
      {/* First Name and Last Name Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          error={errors.firstName?.message}
          name="firstName"
          placeholder="First Name"
          register={register}
          type="text"
        />
        <FormInput
          error={errors.lastName?.message}
          name="lastName"
          placeholder="Last Name"
          register={register}
          type="text"
        />
      </div>

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
