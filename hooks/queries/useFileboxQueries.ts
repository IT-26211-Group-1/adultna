"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import {
  UploadUrlResponse,
  DownloadUrlResponse,
  ListFilesResponse,
  DeleteFileResponse,
  QuotaResponse,
  GenerateUploadUrlRequest,
  ListFilesRequest,
  FileMetadata,
} from "@/types/filebox";

const fileboxApi = {
  generateUploadUrl: (
    request: GenerateUploadUrlRequest
  ): Promise<UploadUrlResponse> =>
    ApiClient.post("/filebox/upload", request, {}, API_CONFIG.API_URL),

  // Upload file to S3
  uploadToS3: async (uploadUrl: string, file: File): Promise<void> => {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
        "Content-Disposition": "inline",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("S3 upload error:", errorText);
      throw new ApiError(
        "Failed to upload file to storage",
        response.status,
        null
      );
    }
  },

  // Generate pre-signed download URL
  generateDownloadUrl: (fileId: string): Promise<DownloadUrlResponse> =>
    ApiClient.get(`/filebox/download/${fileId}`, {}, API_CONFIG.API_URL),

  // List files
  listFiles: (params?: ListFilesRequest): Promise<ListFilesResponse> => {
    const queryParams = params?.category ? `?category=${params.category}` : "";

    return ApiClient.get(
      `/filebox/files${queryParams}`,
      {},
      API_CONFIG.API_URL
    );
  },

  // Delete file
  deleteFile: (fileId: string): Promise<DeleteFileResponse> =>
    ApiClient.delete(`/filebox/files/${fileId}`, {}, API_CONFIG.API_URL),

  // Get user storage limit
  getUserQuota: (): Promise<QuotaResponse> =>
    ApiClient.get("/filebox/quota", {}, API_CONFIG.API_URL),
};

// Query Hooks

/**
 * Hook to fetch user's files
 * @param category
 */
export function useFileboxFiles(category?: string) {
  const backendCategory = category
    ? (Object.entries({
        "Government Documents": "government-id",
        Education: "education",
        Career: "employment",
        Medical: "healthcare",
        Personal: "other",
      }).find(([key]) => key === category)?.[1] as
        | "government-id"
        | "employment"
        | "education"
        | "financial"
        | "healthcare"
        | "legal"
        | "other"
        | undefined)
    : undefined;

  return useQuery({
    queryKey: queryKeys.filebox.list(backendCategory),
    queryFn: () =>
      fileboxApi.listFiles(
        backendCategory ? { category: backendCategory } : undefined
      ),
    staleTime: 30 * 1000, // 30 seconds
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.isUnauthorized || error.isForbidden) {
          return false;
        }
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
  });
}

/**
 * Hook to fetch storage limit
 */
export function useFileboxQuota() {
  return useQuery({
    queryKey: queryKeys.filebox.quota(),
    queryFn: fileboxApi.getUserQuota,
    staleTime: 60 * 1000, // 1 minute
    gcTime: 5 * 60 * 1000, // 5 minutes
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (error.isUnauthorized || error.isForbidden) {
          return false;
        }
      }

      return failureCount < API_CONFIG.RETRY.MAX_ATTEMPTS;
    },
  });
}

// Mutation Hooks
export function useFileboxUpload() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      file,
      category,
    }: {
      file: File;
      category: string;
    }) => {
      const backendCategory = (Object.entries({
        "Government Documents": "government-id",
        Education: "education",
        Career: "employment",
        Medical: "healthcare",
        Personal: "other",
      }).find(([key]) => key === category)?.[1] || "other") as
        | "government-id"
        | "employment"
        | "education"
        | "financial"
        | "healthcare"
        | "legal"
        | "other";

      // Get pre-signed upload URL
      const uploadUrlResponse = await fileboxApi.generateUploadUrl({
        fileName: file.name,
        category: backendCategory,
        contentType: file.type,
        fileSize: file.size,
      });

      if (!uploadUrlResponse.success) {
        throw new ApiError(
          uploadUrlResponse.message || "Failed to generate upload URL",
          400,
          null
        );
      }

      // Upload file to S3
      await fileboxApi.uploadToS3(uploadUrlResponse.data.uploadUrl, file);

      return uploadUrlResponse;
    },
    onSuccess: async () => {
      // Invalidate and refetch files list
      await queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.all,
      });

      // Refetch quota to update storage usage
      await queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.quota(),
      });
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry quota exceeded or validation errors
        if (error.status === 400 || error.status === 403) {
          return false;
        }
      }

      return failureCount < 1;
    },
  });
}

/**
 * Hook to download a file
 * Gets pre-signed download URL and triggers browser download
 */
export function useFileboxDownload() {
  return useMutation({
    mutationFn: async (file: FileMetadata) => {
      const downloadUrlResponse = await fileboxApi.generateDownloadUrl(file.id);

      if (!downloadUrlResponse.success) {
        throw new ApiError(
          downloadUrlResponse.message || "Failed to generate download URL",
          400,
          null
        );
      }

      // Trigger browser download
      const link = document.createElement("a");

      link.href = downloadUrlResponse.data.downloadUrl;
      link.download = downloadUrlResponse.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      return downloadUrlResponse;
    },
    retry: false,
  });
}

/**
 * Hook to view a file in browser
 * Gets pre-signed download URL and opens in new tab for preview
 */
export function useFileboxView() {
  return useMutation({
    mutationFn: async (file: FileMetadata) => {
      const downloadUrlResponse = await fileboxApi.generateDownloadUrl(file.id);

      if (!downloadUrlResponse.success) {
        throw new ApiError(
          downloadUrlResponse.message || "Failed to generate preview URL",
          400,
          null
        );
      }

      // Open in new tab for preview
      window.open(downloadUrlResponse.data.downloadUrl, "_blank");

      return downloadUrlResponse;
    },
    retry: false, // Don't retry view operations
  });
}

/**
 * Hook to delete a file
 */
export function useFileboxDelete() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (fileId: string) => {
      const response = await fileboxApi.deleteFile(fileId);

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to delete file",
          400,
          null
        );
      }

      return response;
    },
    onSuccess: async () => {
      // Invalidate and refetch files list
      await queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.all,
      });

      // Refetch quota to update storage usage
      await queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.quota(),
      });
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry not found or validation errors
        if (error.status === 404 || error.status === 400) {
          return false;
        }
      }

      return failureCount < 1;
    },
  });
}
