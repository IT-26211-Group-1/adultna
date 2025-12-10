"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/modal";
import { useDeleteAccount } from "@/hooks/queries/useProfileQueries";
import { Trash2, Lock, Eye, EyeOff } from "lucide-react";
import { logger } from "@/lib/logger";

export function DeleteAccountSection() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const deleteAccount = useDeleteAccount();

  const handleDeleteClick = () => {
    onOpen();
    setPassword("");
    setPasswordError("");
  };

  const handleConfirmDelete = async () => {
    if (!password) {
      setPasswordError("Password is required");

      return;
    }

    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");

      return;
    }

    try {
      await deleteAccount.mutateAsync({ password });
    } catch (error: any) {
      logger.error("Failed to delete account:", error);

      // Handle specific error cases
      if (error.status === 401) {
        setPasswordError("Incorrect password. Please try again.");
      } else if (error.status === 500) {
        setPasswordError(
          "Server error occurred. Please try again later or contact support.",
        );
      } else if (error.message?.toLowerCase().includes("password")) {
        setPasswordError(error.message);
      } else {
        setPasswordError("An unexpected error occurred. Please try again.");
      }
    }
  };

  const handleCloseModal = () => {
    if (!deleteAccount.isPending) {
      onClose();
      setPassword("");
      setPasswordError("");
    }
  };

  return (
    <div className="border border-red-200 rounded-lg p-6 bg-red-50/50">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 mt-1">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <Trash2 className="w-5 h-5 text-red-600" />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Delete Account
          </h3>
          <p className="text-sm text-red-800 mb-4">
            Once you delete your account, there is no going back. All your data
            will be permanently removed. Please be certain.
          </p>

          <Button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 border-0"
            size="sm"
            onPress={handleDeleteClick}
          >
            Delete My Account
          </Button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        backdrop="blur"
        classNames={{
          wrapper: "z-[200]",
          backdrop: "z-[150]",
        }}
        isOpen={isOpen}
        placement="center"
        size="md"
        onClose={handleCloseModal}
      >
        <ModalContent className="max-w-lg">
          <ModalHeader className="pb-1">
            <h3 className="text-lg font-semibold text-gray-900">
              Delete Account
            </h3>
          </ModalHeader>

          <ModalBody className="space-y-6 pt-1">
            <p className="text-gray-600">
              Are you sure you want to delete your account?
            </p>

            {/* Warning Section */}
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-r-lg">
              <p className="text-sm text-red-800">
                <span className="font-semibold">Warning:</span> This action{" "}
                <span className="font-semibold">cannot be undone</span>.
                Deleting your account will remove all your associated data. Any
                profile information, documents, settings, and more will be{" "}
                <span className="font-semibold">permanently lost</span>.
              </p>
            </div>

            {/* Password confirmation */}
            <div className="space-y-3">
              <p className="text-sm text-gray-700">
                To delete, type your password below
              </p>
              <Input
                autoComplete="current-password"
                classNames={{
                  input: "bg-transparent",
                  inputWrapper: "bg-default-100",
                }}
                endContent={
                  <button
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                }
                errorMessage={passwordError}
                id="delete-password"
                isInvalid={!!passwordError}
                placeholder="Enter your password"
                startContent={<Lock className="w-4 h-4 text-gray-400" />}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
              />
            </div>
          </ModalBody>

          <ModalFooter className="pt-6">
            <Button
              color="default"
              isDisabled={deleteAccount.isPending}
              variant="flat"
              onPress={handleCloseModal}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              isDisabled={!password || !!passwordError}
              isLoading={deleteAccount.isPending}
              onPress={handleConfirmDelete}
            >
              {deleteAccount.isPending ? "Deleting..." : "Yes, Delete Account"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}
