"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient, ApiError, queryKeys } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";
import { logger } from "@/lib/logger";
import {
  UploadUrlResponse,
  DownloadUrlResponse,
  ListFilesResponse,
  DeleteFileResponse,
  QuotaResponse,
  GenerateUploadUrlRequest,
  ListFilesRequest,
  FileMetadata,
  RequestDocumentOTPRequest,
  RequestDocumentOTPResponse,
  VerifyDocumentOTPRequest,
  VerifyDocumentOTPResponse,
  OTPAction,
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

      logger.error("S3 upload error:", errorText);
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

  // Rename file
  renameFile: (
    fileId: string,
    fileName: string,
    replaceDuplicate?: boolean,
    keepBoth?: boolean
  ): Promise<any> =>
    ApiClient.patch(
      `/filebox/files/${fileId}`,
      { fileName, replaceDuplicate, keepBoth },
      {},
      API_CONFIG.API_URL
    ),

  // Get user storage limit
  getUserQuota: (): Promise<QuotaResponse> =>
    ApiClient.get("/filebox/quota", {}, API_CONFIG.API_URL),

  // Request document OTP
  requestDocumentOTP: (
    fileId: string,
    request?: RequestDocumentOTPRequest
  ): Promise<RequestDocumentOTPResponse> =>
    ApiClient.post(
      `/filebox/documents/${fileId}/request-otp`,
      request || {},
      {},
      API_CONFIG.API_URL
    ),

  // Verify document OTP
  verifyDocumentOTP: (
    fileId: string,
    request: VerifyDocumentOTPRequest
  ): Promise<VerifyDocumentOTPResponse> =>
    ApiClient.post(
      `/filebox/documents/${fileId}/verify-otp`,
      request,
      {},
      API_CONFIG.API_URL
    ),
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
      isSecure,
      replaceDuplicate,
      keepBoth,
    }: {
      file: File;
      category: string;
      isSecure?: boolean;
      replaceDuplicate?: boolean;
      keepBoth?: boolean;
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
        isSecure: isSecure || false,
        replaceDuplicate: replaceDuplicate || false,
        keepBoth: keepBoth || false,
      });

      if (!uploadUrlResponse.success) {
        if (uploadUrlResponse.statusCode === 409) {
          return uploadUrlResponse;
        }
        throw new ApiError(
          uploadUrlResponse.message || "Failed to generate upload URL",
          uploadUrlResponse.statusCode || 400,
          null
        );
      }

      // Upload file to S3
      if (uploadUrlResponse.data?.uploadUrl) {
        await fileboxApi.uploadToS3(uploadUrlResponse.data.uploadUrl, file);
      }

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
 * Gets pre-signed download URL and triggers browser download with correct filename
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

      // Fetch the file as a blob to ensure proper download with original filename
      const response = await fetch(downloadUrlResponse.data.downloadUrl);

      if (!response.ok) {
        throw new ApiError(
          "Failed to fetch file from storage",
          response.status,
          null
        );
      }

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Trigger browser download with original filename
      const link = document.createElement("a");

      link.href = blobUrl;
      link.download = downloadUrlResponse.data.fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Clean up the blob URL
      window.URL.revokeObjectURL(blobUrl);

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

/**
 * Hook to rename a file
 */
export function useFileboxRename() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      fileId,
      fileName,
      replaceDuplicate,
      keepBoth,
    }: {
      fileId: string;
      fileName: string;
      replaceDuplicate?: boolean;
      keepBoth?: boolean;
    }) => {
      const response = await fileboxApi.renameFile(
        fileId,
        fileName,
        replaceDuplicate,
        keepBoth
      );

      if (!response.success) {
        if (response.statusCode === 409) {
          return response;
        }
        throw new ApiError(
          response.message || "Failed to rename file",
          response.statusCode || 400,
          null
        );
      }

      return response;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.all,
      });
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        if (
          error.status === 404 ||
          error.status === 400 ||
          error.status === 409
        ) {
          return false;
        }
      }

      return failureCount < 1;
    },
  });
}

/**
 * Hook to request OTP for secure document access
 * Sends OTP to user's email with 5-minute expiration
 */
export function useRequestDocumentOTP() {
  return useMutation({
    mutationFn: async ({
      fileId,
      action,
    }: {
      fileId: string;
      action?: OTPAction;
    }) => {
      const response = await fileboxApi.requestDocumentOTP(
        fileId,
        action ? { action } : undefined
      );

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to request OTP",
          400,
          null
        );
      }

      return response;
    },
    retry: (failureCount, error) => {
      if (error instanceof ApiError) {
        // Don't retry rate limit or validation errors
        if (error.status === 429 || error.status === 400) {
          return false;
        }
      }

      return failureCount < 1;
    },
  });
}

/**
 * Hook to verify OTP and get document download URL
 * OTP is one-time use and expires after 5 minutes
 */
export function useVerifyDocumentOTP() {
  return useMutation({
    mutationFn: async ({
      fileId,
      otp,
      action,
    }: {
      fileId: string;
      otp: string;
      action?: OTPAction;
    }) => {
      const response = await fileboxApi.verifyDocumentOTP(fileId, {
        otp,
        action,
      });

      if (!response.success) {
        throw new ApiError(
          response.message || "Failed to verify OTP",
          400,
          null
        );
      }

      return response;
    },
    retry: false, // Don't retry OTP verification
  });
}
