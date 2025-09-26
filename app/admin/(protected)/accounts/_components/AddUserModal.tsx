"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import {
  addUserSchema,
  AddUserForm,
  Role,
  roleDisplayLabels,
} from "@/validators/adminSchema";
import { addToast } from "@heroui/toast";
import { useAdminUsers } from "@/hooks/queries/admin/useAdminQueries";

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  const { createUser, isCreatingUser } = useAdminUsers();

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      role: "user",
    },
  });

  const onSubmit = handleSubmit(async (data: AddUserForm) => {
    createUser(data, {
      onSuccess: (response) => {
        if (response.success) {
          handleClose();

          addToast({
            title: response.message || "Account created successfully",
            color: "success",
            timeout: 4000,
          });
        }
      },
      onError: (error: any) => {
        addToast({
          title: error?.message || "Failed to create account",
          color: "danger",
          timeout: 4000,
        });
      }
    });
  });

  const handleClose = () => {
    reset(); // Clear form state
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title="Add New User">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name *
          </label>
          <input
            {...register("firstName")}
            type="text"
            id="firstName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            placeholder="Enter first name"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">{errors.firstName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
            Last Name *
          </label>
          <input
            {...register("lastName")}
            type="text"
            id="lastName"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            placeholder="Enter last name"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">{errors.lastName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email Address *
          </label>
          <input
            {...register("email")}
            type="email"
            id="email"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">
            Role *
          </label>
          <select
            {...register("role")}
            id="role"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
          >
            {Object.entries(roleDisplayLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.role && (
            <p className="mt-1 text-sm text-red-600">{errors.role.message}</p>
          )}
        </div>

        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
          <p><strong>Note:</strong> A temporary password will be generated and sent to the user's email address.</p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cancel
          </button>
          <LoadingButton
            type="submit"
            loading={isCreatingUser}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
          >
            Create User
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}