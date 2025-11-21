"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import { addToast } from "@heroui/toast";
import { User } from "./useAuthQueries";

export type Profile = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  displayName?: string | null;
  profilePictureUrl?: string | null;
  lifeStage?: string | null;
  onboardingStatus?: "not_started" | "in_progress" | "completed";
};

export type UpdateProfileRequest = {
  firstName?: string;
  lastName?: string;
  displayName?: string;
  profilePictureUrl?: string;
};

export type UpdatePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type DeleteAccountRequest = {
  password: string;
};

export type UploadProfilePictureRequest = {
  fileExtension: string;
};

export type UploadProfilePictureResponse = {
  success: boolean;
  message: string;
  data: {
    uploadUrl: string;
    publicUrl: string;
  };
};

const profileApi = {
  updateProfile: (
    data: UpdateProfileRequest,
  ): Promise<{ success: boolean; message: string; data: Profile }> =>
    ApiClient.patch("/profile", data),

  updatePassword: (
    data: UpdatePasswordRequest,
  ): Promise<{ success: boolean; message: string }> =>
    ApiClient.patch("/profile/password", data),

  deleteAccount: (
    data: DeleteAccountRequest,
  ): Promise<{ success: boolean; message: string }> =>
    ApiClient.delete("/profile/account", { body: JSON.stringify(data) }),

  uploadProfilePicture: (
    data: UploadProfilePictureRequest,
  ): Promise<UploadProfilePictureResponse> =>
    ApiClient.post("/profile/picture/upload", data),
};

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.updateProfile,
    onSuccess: (response) => {
      addToast({
        title: response.message || "Profile updated successfully",
        color: "success",
      });

      queryClient.setQueryData<User>(queryKeys.auth.me(), (old) => {
        if (!old) return old;

        return {
          ...old,
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          displayName:
            response.data.displayName ||
            `${response.data.firstName} ${response.data.lastName}`,
          profilePictureUrl: response.data.profilePictureUrl,
        };
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: (error: any) => {
      addToast({
        title: error.message || "Failed to update profile",
        color: "danger",
      });
    },
  });
}

export function useUpdatePassword() {
  return useMutation({
    mutationFn: profileApi.updatePassword,
    onSuccess: (response) => {
      addToast({
        title: response.message || "Password updated successfully",
        color: "success",
      });
    },
    onError: (error: any) => {
      addToast({
        title: error.message || "Failed to update password",
        color: "danger",
      });
    },
  });
}

export function useDeleteAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: profileApi.deleteAccount,
    onSuccess: (response) => {
      addToast({
        title: response.message || "Account deleted successfully",
        color: "success",
      });
      queryClient.clear();
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/auth/login";
    },
    onError: (error: any) => {
      addToast({
        title: error.message || "Failed to delete account",
        color: "danger",
      });
    },
  });
}

export function useUploadProfilePicture() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileExtension,
      file,
    }: {
      fileExtension: string;
      file: File;
    }) => {
      const uploadResponse = await profileApi.uploadProfilePicture({
        fileExtension,
      });

      await fetch(uploadResponse.data.uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      return uploadResponse.data.publicUrl;
    },
    onSuccess: (publicUrl) => {
      addToast({
        title: "Profile picture uploaded successfully",
        color: "success",
      });

      queryClient.setQueryData<User>(queryKeys.auth.me(), (old) => {
        if (!old) return old;

        return {
          ...old,
          profilePictureUrl: publicUrl,
        };
      });

      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
    },
    onError: (error: any) => {
      addToast({
        title: error.message || "Failed to upload profile picture",
        color: "danger",
      });
    },
  });
}
