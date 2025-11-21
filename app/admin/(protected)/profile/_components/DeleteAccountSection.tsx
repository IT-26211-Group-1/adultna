"use client";

import { useState } from "react";
import { Button, Input } from "@heroui/react";
import { ConfirmationModal } from "./ConfirmationModal";
import { useDeleteAccount } from "@/hooks/queries/useProfileQueries";
import { Trash2 } from "lucide-react";

export function DeleteAccountSection() {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const deleteAccount = useDeleteAccount();

  const handleDeleteClick = () => {
    setShowConfirmModal(true);
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
    } catch (error) {
      console.error("Failed to delete account:", error);
    }
  };

  const handleCloseModal = () => {
    if (!deleteAccount.isPending) {
      setShowConfirmModal(false);
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
      <ConfirmationModal
        cancelText="Cancel"
        confirmText="Delete Account"
        isLoading={deleteAccount.isPending}
        open={showConfirmModal}
        title="Delete Account"
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            This action cannot be undone. This will permanently delete your
            account and remove all your data from our servers.
          </p>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-2"
              htmlFor="delete-password"
            >
              Please enter your password to confirm:
            </label>
            <Input
              errorMessage={passwordError}
              id="delete-password"
              isInvalid={!!passwordError}
              placeholder="Enter your password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setPasswordError("");
              }}
            />
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm font-semibold text-red-900 mb-2">
              Warning: This will delete:
            </p>
            <ul className="text-sm text-red-800 space-y-1 list-disc list-inside">
              <li>Your profile information</li>
              <li>All your uploaded documents</li>
              <li>Your account settings and preferences</li>
              <li>All associated data</li>
            </ul>
          </div>
        </div>
      </ConfirmationModal>
    </div>
  );
}
