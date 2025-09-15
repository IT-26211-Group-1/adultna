"use client";
import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { useFormSubmit } from "@/hooks/useForm";
import {
  addUserSchema,
  AddUserForm,
  Role,
  roleDisplayLabels,
} from "@/validators/adminSchema";
import { addToast } from "@heroui/toast";

export function AddUserModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [formData, setFormData] = useState<AddUserForm>({
    firstName: "",
    lastName: "",
    email: "",
    role: "user",
  });

  const { loading, error, onSubmit } = useFormSubmit({
    apiUrl: "/api/admin/accounts/add-account",
    schema: addUserSchema,
    requireCaptcha: false,
    showToast: false,
    onSuccess: (response) => {
      onClose();
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "user",
      });

      addToast({
        title: (response as any)?.message || "Account created successfully",
        color: "success",
        timeout: 4000,
      });
    },
    onError: (error) => {
      const message =
        typeof error === "string"
          ? error
          : (error as any)?.message || "Failed to create user";
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const updateField = (field: keyof AddUserForm, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add New User"
      description="Create a new user account for the AdultNa platform. The account will be created with a default password that the user can change after first login."
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

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Role
          </label>
          <select
            className="mt-1 block w-full rounded border px-3 py-2"
            value={formData.role}
            onChange={(e) => updateField("role", e.target.value)}
          >
            {Object.entries(roleDisplayLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        {error && <div className="text-red-600 text-sm">{error}</div>}

        <div className="pt-2 flex justify-end">
          <div className="w-48">
            <LoadingButton loading={loading} type="submit">
              Create Account
            </LoadingButton>
          </div>
        </div>
      </form>
    </Modal>
  );
}
