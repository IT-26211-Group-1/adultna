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
          htmlFor="current-password"
          className="block text-sm font-medium text-gray-700"
        >
          Current Password
        </label>
        <Input
          id="current-password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Enter current password"
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
        />
      </div>

      {/* New Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="new-password"
          className="block text-sm font-medium text-gray-700"
        >
          New Password
        </label>
        <Input
          id="new-password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
        />
      </div>

      {/* Confirm Password Field */}
      <div className="space-y-2">
        <label
          htmlFor="confirm-password"
          className="block text-sm font-medium text-gray-700"
        >
          Confirm Password
        </label>
        <Input
          id="confirm-password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          classNames={{
            input: "text-gray-900",
            inputWrapper: "border border-gray-300 bg-white",
          }}
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
