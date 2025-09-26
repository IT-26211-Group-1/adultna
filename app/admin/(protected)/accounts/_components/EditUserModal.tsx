"use client";

import React, { useMemo } from "react";
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

export function EditUserModal({
  open,
  onClose,
  user,
  onUserUpdated,
}: EditUserModalProps) {
  const { updateUser, isUpdatingUser } = useAdminUsers();

  // Derive initial form data from user prop - no useEffect needed
  const defaultValues = useMemo<UpdateUserForm>(() => ({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
  }), [user?.id, open]); // Reset when user changes or modal opens

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<UpdateUserForm>({
    resolver: zodResolver(updateUserSchema),
    defaultValues,
  });

  // Reset form when modal opens or user changes
  React.useEffect(() => {
    if (open && user) {
      reset(defaultValues);
    }
  }, [open, user?.id, reset, defaultValues]);

  const onSubmit = handleSubmit(async (data: UpdateUserForm) => {
    if (!user?.id) return;

    updateUser(
      { userId: user.id, ...data },
      {
        onSuccess: (response) => {
          if (response.success && response.user) {
            // Update user object with new data
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
        }
      }
    );
  });

  const handleClose = () => {
    reset(); // Clear form state
    onClose();
  };

  if (!user) return null;

  return (
    <Modal open={open} onClose={handleClose} title="Edit User">
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
            First Name
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
            Last Name
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
            Email Address
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
            loading={isUpdatingUser}
            disabled={!isDirty}
            className="px-4 py-2 text-sm font-medium text-white bg-adult-green border border-transparent rounded-md hover:bg-adult-green/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-adult-green disabled:opacity-50"
          >
            Update User
          </LoadingButton>
        </div>
      </form>
    </Modal>
  );
}