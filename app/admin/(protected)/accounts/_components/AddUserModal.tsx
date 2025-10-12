"use client";

import React, { memo, useMemo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import {
  addUserSchema,
  AddUserForm,
  roleDisplayLabels,
} from "@/validators/adminSchema";
import { addToast } from "@heroui/toast";
import { useAdminUsers } from "@/hooks/queries/admin/useAdminQueries";

interface AddUserModalProps {
  open?: boolean;
  onClose?: () => void;
}

function AddUserModal({ open = false, onClose = () => {} }: AddUserModalProps) {
  const { createUser, isCreatingUser } = useAdminUsers();

  // Memoized role options to prevent creation on rerender
  const roleOptions = useMemo(
    () =>
      Object.entries(roleDisplayLabels).map(([value, label]) => ({
        value,
        label,
      })),
    [],
  );

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

  // Memoized submit handler
  const onSubmit = useCallback(
    handleSubmit(async (data: AddUserForm) => {
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
        },
      });
    }),
    [createUser, handleSubmit],
  );

  // Memoized close handler
  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  return (
    <Modal open={open} title="Add New User" onClose={handleClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="firstName"
          >
            First Name *
          </label>
          <input
            {...register("firstName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="firstName"
            placeholder="Enter first name"
            type="text"
          />
          {errors.firstName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.firstName.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="lastName"
          >
            Last Name *
          </label>
          <input
            {...register("lastName")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="lastName"
            placeholder="Enter last name"
            type="text"
          />
          {errors.lastName && (
            <p className="mt-1 text-sm text-red-600">
              {errors.lastName.message}
            </p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="email"
          >
            Email Address *
          </label>
          <input
            {...register("email")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="email"
            placeholder="Enter email address"
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="role"
          >
            Role *
          </label>
          <select
            {...register("role")}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-adult-green focus:border-adult-green"
            id="role"
          >
            {roleOptions.map(({ value, label }) => (
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
          <p>
            <strong>Note:</strong> A temporary password will be generated and
            sent to the user&apos;s email address.
          </p>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            type="button"
            onClick={handleClose}
          >
            Cancel
          </button>
          <LoadingButton
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
            disabled={!isDirty}
            loading={isCreatingUser}
            type="submit"
          >
            Create User
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(AddUserModal);
