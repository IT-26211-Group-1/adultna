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
import { ConfirmationModal } from "./ConfirmationModal";
import { FormInput } from "@/app/auth/register/_components/FormInput";
import {
  passwordUpdateSchema,
  PasswordUpdateInput,
} from "@/validators/profileSchema";
import { useState, useEffect, useCallback } from "react";
import { useUpdatePassword } from "@/hooks/queries/useProfileQueries";

export function PasswordForm() {
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure();
  const [isSaving, setIsSaving] = useState(false);
  const [showRefreshModal, setShowRefreshModal] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [formKey, setFormKey] = useState(0);

  const updatePassword = useUpdatePassword();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<PasswordUpdateInput>({
    resolver: zodResolver(passwordUpdateSchema),
    mode: "onChange",
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

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
      onConfirmOpen();
    })();
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);

    handleSubmit(async (data) => {
      try {
        await updatePassword.mutateAsync({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        });

        // Reset form immediately after success
        setTimeout(() => {
          setFormKey((prev) => prev + 1); // Force remount
          reset({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
          onConfirmClose();
          setHasUnsavedChanges(false);
          updatePassword.reset(); // Reset mutation state
        }, 0);
      } catch (error) {
        console.error("Failed to update password:", error);
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

  const handleRefreshConfirm = () => {
    setHasUnsavedChanges(false);
    setShowRefreshModal(false);
    window.location.reload();
  };

  const handleRefreshCancel = () => {
    setShowRefreshModal(false);
  };

  return (
    <div key={formKey} className="space-y-6">
      {/* Current Password Field */}
      <FormInput
        autoComplete="current-password"
        error={errors.currentPassword?.message}
        name="currentPassword"
        placeholder="Current Password"
        register={register}
        type="password"
      />

      {/* New Password and Confirm Password Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormInput
          autoComplete="new-password"
          error={errors.newPassword?.message}
          name="newPassword"
          placeholder="New Password"
          register={register}
          type="password"
        />
        <FormInput
          autoComplete="new-password"
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
          className={`font-medium px-6 py-2.5 rounded-xl border transition-all duration-300 ${
            hasUnsavedChanges
              ? "bg-adult-green hover:bg-adult-green/90 text-white border-adult-green hover:border-adult-green/90 hover:scale-[1.02]"
              : "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
          }`}
          isDisabled={!hasUnsavedChanges}
          size="md"
          onPress={handleSaveClick}
        >
          Save Changes
        </Button>
      </div>

      {/* Update Password Confirmation Modal */}
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
              Update Password
            </h3>
          </ModalHeader>

          <ModalBody className="space-y-4 pt-1">
            <p className="text-gray-600">
              Are you sure you want to update your password?
            </p>

            <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
              <p className="text-sm text-amber-800">
                <span className="font-semibold">Important:</span> You will need
                to use the new password for all future logins. Make sure you
                remember or save your new password securely.
              </p>
            </div>
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
              {isSaving ? "Updating Password..." : "Yes, Update Password"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
