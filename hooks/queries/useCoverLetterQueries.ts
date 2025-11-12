"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import type {
  CoverLetter,
  CreateCoverLetterInput,
  UpdateCoverLetterInput,
  GenerateUploadUrlResponse,
  ImportResumeInput,
  ImproveCoverLetterInput,
  ChangeToneInput,
  AIImprovement,
  CoverLetterSection,
  CoverLetterStyle,
} from "@/types/cover-letter";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  coverLetter?: T;
  coverLetters?: T[];
  data?: any;
}

export function useCoverLetters() {
  return useQuery({
    queryKey: queryKeys.coverLetters.list(),
    queryFn: async () => {
      const response = await ApiClient.get<ApiResponse<CoverLetter[]>>(
        "/cover-letters"
      );

      return response.data || [];
    },
  });
}

export function useCoverLetter(coverLetterId?: string) {
  return useQuery({
    queryKey: queryKeys.coverLetters.detail(coverLetterId!),
    queryFn: async () => {
      if (!coverLetterId) {
        throw new Error("Cover letter ID is required");
      }

      const response = await ApiClient.get<ApiResponse<CoverLetter>>(
        `/cover-letters/${coverLetterId}`
      );

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
    enabled: !!coverLetterId,
  });
}

export function useCreateCoverLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateCoverLetterInput) => {
      const response = await ApiClient.post<ApiResponse<CoverLetter>>(
        "/cover-letters",
        data
      );

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.list(),
      });
    },
  });
}

export function useUpdateCoverLetter(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateCoverLetter", coverLetterId],
    mutationFn: async (data: UpdateCoverLetterInput) => {
      const response = await ApiClient.patch<ApiResponse<CoverLetter>>(
        `/cover-letters/${coverLetterId}`,
        data
      );

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.detail(coverLetterId),
      });
    },
  });
}

export function useDeleteCoverLetter() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (coverLetterId: string) => {
      await ApiClient.delete<ApiResponse<never>>(
        `/cover-letters/${coverLetterId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.list(),
      });
    },
  });
}

export function useExportCoverLetter() {
  return useMutation({
    mutationFn: async (coverLetterId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/cover-letters/${coverLetterId}/export`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to export cover letter");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch
        ? filenameMatch[1]
        : "cover-letter.pdf";

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    },
  });
}

export function useGenerateUploadUrl() {
  return useMutation({
    mutationFn: async (data: {
      fileName: string;
      contentType: string;
      fileSize: number;
    }) => {
      const response = await ApiClient.post<
        ApiResponse<GenerateUploadUrlResponse>
      >("/cover-letters/generate-upload-url", data);

      if (!response.data) {
        throw new Error("No upload URL data returned from server");
      }

      return response.data;
    },
  });
}

export function useUploadFile() {
  return useMutation({
    mutationFn: async ({
      uploadUrl,
      file,
    }: {
      uploadUrl: string;
      file: File;
    }) => {
      const response = await fetch(uploadUrl, {
        method: "PUT",
        body: file,
        headers: {
          "Content-Type": file.type,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to upload file");
      }

      return response;
    },
  });
}

export function useImportResume() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ImportResumeInput) => {
      const response = await ApiClient.post<ApiResponse<CoverLetter>>(
        "/cover-letters/import",
        data
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to import resume");
      }

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.list(),
      });
    },
  });
}

export function useAddSection(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      sectionType: string;
      content: string;
      order: number;
    }) => {
      const response = await ApiClient.post<{
        success: boolean;
        data: CoverLetterSection;
      }>(`/cover-letters/${coverLetterId}/sections`, data);

      if (!response.data) {
        throw new Error("No section data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.detail(coverLetterId),
      });
    },
  });
}

export function useUpdateSection(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      sectionId,
      content,
    }: {
      sectionId: string;
      content: string;
    }) => {
      const response = await ApiClient.put<{
        success: boolean;
        data: CoverLetterSection;
      }>(`/cover-letters/${coverLetterId}/sections/${sectionId}`, {
        content,
      });

      if (!response.data) {
        throw new Error("No section data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.detail(coverLetterId),
      });
    },
  });
}

export function useDeleteSection(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (sectionId: string) => {
      await ApiClient.delete(
        `/cover-letters/${coverLetterId}/sections/${sectionId}`
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.detail(coverLetterId),
      });
    },
  });
}

export function useImproveCoverLetter(coverLetterId: string) {
  return useMutation({
    mutationFn: async (data: ImproveCoverLetterInput) => {
      const response = await ApiClient.post<{
        success: boolean;
        data: AIImprovement;
      }>(`/cover-letters/${coverLetterId}/ai/improve`, data);

      if (!response.data) {
        throw new Error("No improvement data returned from server");
      }

      return response.data;
    },
  });
}

export function useChangeTone(coverLetterId: string) {
  return useMutation({
    mutationFn: async (data: ChangeToneInput) => {
      const response = await ApiClient.post<{
        success: boolean;
        data: AIImprovement;
      }>(`/cover-letters/${coverLetterId}/ai/change-tone`, data);

      if (!response.data) {
        throw new Error("No tone change data returned from server");
      }

      return response.data;
    },
  });
}
