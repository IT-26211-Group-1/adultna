"use client";

import { useState } from "react";
import { Input, Button } from "@heroui/react";

export function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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
          className="bg-gray-900 text-white hover:bg-gray-800 font-medium px-8"
          size="md"
        >
          SAVE
        </Button>
      </div>
    </div>
  );
}
