"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { ProfilePicture } from "./ProfilePicture";
import { ConfirmationModal } from "./ConfirmationModal";

export function ProfileForm() {
  const [displayName, setDisplayName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Add your save logic here
    console.log("Saving profile:", { displayName, firstName, lastName, email });
    
    setIsSaving(false);
    setShowConfirmModal(false);
    
    // You can add a success toast notification here
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
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="displayName"
        >
          Display Name
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="displayName"
          placeholder="Enter your display name"
          type="text"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
      </div>

      {/* First Name Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="firstName"
        >
          First Name
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="firstName"
          placeholder="Enter your first name"
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
      </div>

      {/* Last Name Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="lastName"
        >
          Last Name
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="lastName"
          placeholder="Enter your last name"
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>

      {/* Email Field */}
      <div className="space-y-2">
        <label
          className="block text-sm font-medium text-gray-700"
          htmlFor="email"
        >
          Email
        </label>
        <Input
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
          id="email"
          placeholder="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
