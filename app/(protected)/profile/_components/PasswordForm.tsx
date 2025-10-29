"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { ConfirmationModal } from "./ConfirmationModal";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = () => {
    // Basic validation
    if (!currentPassword || !newPassword || !confirmPassword) {
      alert("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match");
      return;
    }

    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Add your password update logic here
    console.log("Updating password");
    
    setIsSaving(false);
    setShowConfirmModal(false);
    
    // Clear form after successful update
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    
    // You can add a success toast notification here
  };

  const handleCloseModal = () => {
    if (!isSaving) {
      setShowConfirmModal(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Password Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="current-password"
        >
          Current Password
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="current-password"
          placeholder="Enter current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="new-password"
        >
          New Password
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="new-password"
          placeholder="Enter new password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="confirm-password"
        >
          Confirm Password
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="confirm-password"
          placeholder="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>

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
