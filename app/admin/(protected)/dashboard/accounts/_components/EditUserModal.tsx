"use client";

import React, { useState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { useFormSubmit } from "@/hooks/useForm";
import { updateUserSchema, UpdateUserForm } from "@/validators/adminSchema";
import { addToast } from "@heroui/toast";
import { User } from "@/types/admin";

export function EditUserModal({
  open,
  onClose,
  user,
  onUserUpdated,
}: {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (updatedUser: User) => void;
}) {
  const [formData, setFormData] = useState<UpdateUserForm>({
    firstName: "",
    lastName: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        email: user.email,
      });
    }
  }, [user]);

  const { loading, error, onSubmit } = useFormSubmit({
    apiUrl: `/api/admin/update-account/${user?.id}`,
    schema: updateUserSchema,
    requireCaptcha: false,
    showToast: false,
    onSuccess: (response) => {
      onClose();

      if ((response as any)?.user) {
        const updatedUser: User = {
          ...user!,
          firstName: (response as any).user.firstName,
          lastName: (response as any).user.lastName,
          email: (response as any).user.email,
          displayName: (response as any).user.displayName,
        };
        onUserUpdated(updatedUser);
      }

      addToast({
        title: (response as any)?.message || "Account updated successfully",
        color: "success",
        timeout: 4000,
      });
    },
    onError: (error) => {
      const message =
        typeof error === "string"
          ? error
          : (error as any)?.message || "Failed to update user";
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateField = (field: keyof UpdateUserForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!user) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Edit User Account"
      description={`Update account information for ${user.displayName || `${user.firstName} ${user.lastName}`}`}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            First Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Enter first name"
            value={formData.firstName}
            onChange={(e) => updateField("firstName", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Last Name
          </label>
          <input
            type="text"
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Enter last name"
            value={formData.lastName}
            onChange={(e) => updateField("lastName", e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="mt-1 block w-full rounded border px-3 py-2"
            placeholder="Enter email address"
            value={formData.email}
            onChange={(e) => updateField("email", e.target.value)}
            required
          />
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="pt-2 flex justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
          <div className="w-32">
            <LoadingButton loading={loading} type="submit">
              Update Account
            </LoadingButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
