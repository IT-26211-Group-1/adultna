"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { ProfilePicture } from "./ProfilePicture";
import { ConfirmationModal } from "./ConfirmationModal";
import { FormInput } from "@/app/auth/register/_components/FormInput";
import {
  profileUpdateSchema,
  ProfileUpdateInput,
} from "@/validators/profileSchema";
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/hooks/queries/useAuthQueries";
import { useUpdateProfile } from "@/hooks/queries/useProfileQueries";

export function ProfileForm() {
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [profilePictureChanged, setProfilePictureChanged] = useState(false);

  const { user } = useAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty, dirtyFields },
    reset,
    getValues,
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
        displayName: user.displayName || "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email || "",
      });
    }
  }, [user, reset]);

  // Track changes in form values and profile picture
  useEffect(() => {
    const hasChanges = isDirty || profilePictureChanged;

    setHasUnsavedChanges(hasChanges);
  }, [isDirty, profilePictureChanged]);

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
      onConfirmOpen();
    })();
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    handleSubmit(async (data) => {
      try {
        await updateProfile.mutateAsync({
          firstName: data.firstName,
          lastName: data.lastName,
          displayName: data.displayName,
        });

        onConfirmClose();
        setProfilePictureChanged(false);
        reset(data);
        setHasUnsavedChanges(false);
      } catch (error) {
        console.error("Failed to update profile:", error);
      } finally {
        setIsSaving(false);
      }
    })();
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      onConfirmClose();
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
          className={`font-medium px-6 py-2.5 rounded-xl border transition-all duration-300 ${
            hasUnsavedChanges
              ? "bg-adult-green hover:bg-adult-green/90 text-white border-adult-green hover:border-adult-green/90 hover:scale-[1.02]"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
          size="md"
          isDisabled={!hasUnsavedChanges}
          onPress={handleSaveClick}
        >
          Save Changes
        </Button>
      </div>

      {/* Save Confirmation Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          wrapper: "z-[200]",
          backdrop: "z-[150]",
        }}
        isOpen={isConfirmOpen}
        placement="center"
        size="md"
        onClose={handleCloseModal}
      >
        <ModalContent className="max-w-lg">
          <ModalHeader className="pb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Save Profile Changes
            </h3>
          </ModalHeader>

          <ModalBody className="space-y-4 pt-1">
            <p className="text-gray-600">
              Review your changes and confirm to save them to your profile.
            </p>

            {/* Show changed fields */}
            {(isDirty || profilePictureChanged) && (
              <div className="space-y-3">
                <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-lg">
                  <p className="text-sm font-semibold text-blue-800 mb-3">
                    Changes to be saved:
                  </p>

                  <div className="space-y-3">
                    {/* Profile Picture Change */}
                    {profilePictureChanged && (
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-medium text-blue-700 mb-1">Profile Picture</p>
                        <p className="text-sm text-gray-700">New profile picture will be saved</p>
                      </div>
                    )}

                    {/* Display Name */}
                    {dirtyFields.displayName && (
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-medium text-blue-700 mb-1">Display Name</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{user?.displayName || '(empty)'}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-900 font-medium">{getValues('displayName') || '(empty)'}</span>
                        </div>
                      </div>
                    )}

                    {/* First Name */}
                    {dirtyFields.firstName && (
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-medium text-blue-700 mb-1">First Name</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{user?.firstName || '(empty)'}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-900 font-medium">{getValues('firstName') || '(empty)'}</span>
                        </div>
                      </div>
                    )}

                    {/* Last Name */}
                    {dirtyFields.lastName && (
                      <div className="bg-white/60 rounded-lg p-3 border border-blue-200">
                        <p className="text-xs font-medium text-blue-700 mb-1">Last Name</p>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-gray-500">{user?.lastName || '(empty)'}</span>
                          <span className="text-gray-400">→</span>
                          <span className="text-gray-900 font-medium">{getValues('lastName') || '(empty)'}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </ModalBody>

          <ModalFooter className="pt-6">
            <Button
              color="default"
              isDisabled={isSaving}
              variant="flat"
              onPress={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              className="bg-adult-green text-white hover:bg-adult-green/90"
              isLoading={isSaving}
              onPress={handleConfirmSave}
            >
              {isSaving ? "Saving Changes..." : "Yes, Save Changes"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
