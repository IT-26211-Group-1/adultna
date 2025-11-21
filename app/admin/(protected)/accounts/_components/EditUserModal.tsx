"use client";

import React, { useMemo, memo, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal } from "@/components/ui/Modal";
import { LoadingButton } from "@/components/ui/Button";
import { updateUserSchema, UpdateUserForm } from "@/validators/adminSchema";
import { addToast } from "@heroui/toast";
import { User } from "@/types/admin";
import { useAdminUsers } from "@/hooks/queries/admin/useAdminQueries";

interface EditUserModalProps {
  open: boolean;
  onClose: () => void;
  user: User | null;
  onUserUpdated: (updatedUser: User) => void;
}

function EditUserModal({
  open,
  onClose,
  user,
  onUserUpdated,
}: EditUserModalProps) {
  const { updateUser, isUpdatingUser } = useAdminUsers();

  const defaultValues = useMemo<UpdateUserForm>(
    () => ({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
    }),
    [user?.id, open],
  );

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  // Reset form
  React.useEffect(() => {
    if (open && user) {
      reset(defaultValues);
    }
  }, [open, user?.id, reset, defaultValues]);

  // Memoized submit handler
  const onSubmit = useCallback(
    handleSubmit(async (data: UpdateUserForm) => {
      if (!user?.id) return;

      updateUser(
        { userId: user.id, ...data },
        {
          onSuccess: (response) => {
            if (response.success && response.user) {
              const updatedUser: User = {
                ...user,
                firstName: response.user.firstName,
                lastName: response.user.lastName,
                email: response.user.email,
              };

              onUserUpdated(updatedUser);
              onClose();

              addToast({
                title: response.message || "User updated successfully",
                color: "success",
                timeout: 4000,
              });
            }
          },
          onError: (error: any) => {
            addToast({
              title: error?.message || "Failed to update user",
              color: "danger",
              timeout: 4000,
            });
          },
        },
      );
    }),
    [user?.id, updateUser, onUserUpdated, onClose, handleSubmit],
  );

  const handleClose = useCallback(() => {
    reset();
    onClose();
  }, [reset, onClose]);

  if (!user) return null;

  return (
    <Modal open={open} title="Edit User" onClose={handleClose}>
      <form className="space-y-4" onSubmit={onSubmit}>
        <div>
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="firstName"
          >
            First Name
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
            Last Name
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
            Email Address
          </label>
          <input
            {...register("email")}
            disabled
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-200 cursor-not-allowed"
            id="email"
            placeholder="Enter email address"
            type="email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
          )}
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
            loading={isUpdatingUser}
            type="submit"
          >
            Update User
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}

export default memo(EditUserModal);
