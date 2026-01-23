"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import type {
  CoverLetter,
  ImportResumeInput,
  CoverLetterSection,
  SectionType,
} from "@/types/cover-letter";

interface ApiResponse<T> {
  success: boolean;
  message: string;
  statusCode: number;
  coverLetter?: T;
  coverLetters?: T[];
  data?: any;
}

export function useCoverLetter(coverLetterId?: string) {
  return useQuery({
    queryKey: queryKeys.coverLetters.detail(coverLetterId!),
    queryFn: async () => {
      if (!coverLetterId) {
        throw new Error("Cover letter ID is required");
      }

      const response = await ApiClient.get<ApiResponse<CoverLetter>>(
        `/cover-letters/${coverLetterId}`,
      );

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
    enabled: !!coverLetterId,
    staleTime: 3 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    refetchOnWindowFocus: true,
  });
}

export function useUpdateTitle(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateTitle", coverLetterId],
    mutationFn: async (title: string) => {
      const response = await ApiClient.put<ApiResponse<CoverLetter>>(
        `/cover-letters/${coverLetterId}/title`,
        { title },
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

export function useExportCoverLetter() {
  return useMutation({
    mutationFn: async (coverLetterId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/cover-letters/${coverLetterId}/export`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export cover letter");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "cover-letter.pdf";

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

export function useExportCoverLetterDocx() {
  return useMutation({
    mutationFn: async (coverLetterId: string) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/cover-letters/${coverLetterId}/export-docx`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to export cover letter as Word document");
      }

      const blob = await response.blob();
      const contentDisposition = response.headers.get("Content-Disposition");
      const filenameMatch = contentDisposition?.match(/filename="(.+)"/);
      const filename = filenameMatch ? filenameMatch[1] : "cover-letter.docx";

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
      const response = await ApiClient.post<{
        success: boolean;
        data: {
          uploadUrl: string;
          fileKey: string;
          expiresIn: number;
        };
      }>("/cover-letters/generate-upload-url", data);

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
  return useMutation({
    mutationFn: async (data: ImportResumeInput) => {
      const response = await ApiClient.post<ApiResponse<CoverLetter>>(
        "/cover-letters/import",
        data,
      );

      if (!response.success) {
        throw new Error(response.message || "Failed to import resume");
      }

      if (!response.data) {
        throw new Error("No cover letter data returned from server");
      }

      return response.data;
    },
  });
}

export function useUpdateSection(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSection", coverLetterId],
    mutationFn: async ({
      content,
      sectionType,
    }: {
      content: string;
      sectionType: SectionType;
    }) => {
      if (!sectionType) {
        throw new Error("Section type is required");
      }

      const response = await ApiClient.patch<{
        success: boolean;
        data: CoverLetterSection[];
      }>(`/cover-letters/${coverLetterId}/sections`, {
        sections: [{ sectionType, content }],
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("No section data returned from server");
      }

      return response.data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.coverLetters.detail(coverLetterId),
      });
    },
  });
}

export function useUpdateSections(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["updateSections", coverLetterId],
    mutationFn: async (
      sections: Array<{
        sectionType: SectionType;
        content: string;
      }>,
    ) => {
      if (!sections || sections.length === 0) {
        throw new Error("At least one section is required");
      }

      const response = await ApiClient.patch<{
        success: boolean;
        data: CoverLetterSection[];
      }>(`/cover-letters/${coverLetterId}/sections`, {
        sections,
      });

      if (!response.data || !Array.isArray(response.data)) {
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

export function useSaveToFilebox(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["saveToFilebox", coverLetterId],
    mutationFn: async () => {
      const response = await ApiClient.post<{
        success: boolean;
        message: string;
        data: { fileId: string; fileKey: string };
      }>(`/cover-letters/${coverLetterId}/save-to-filebox`, {});

      if (!response.data) {
        throw new Error("No filebox data returned from server");
      }

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.filebox.quota(),
      });
    },
  });
}

export function useChangeTone(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["changeTone", coverLetterId],
    mutationFn: async ({
      sectionId,
      currentContent,
      targetTone,
    }: {
      sectionId: string;
      currentContent: string;
      targetTone: string;
    }) => {
      const response = await ApiClient.post<{
        success: boolean;
        data: { newContent: string };
      }>(`/cover-letters/${coverLetterId}/ai/change-tone`, {
        sectionId,
        currentContent,
        targetTone,
      });

      if (!response.data) {
        throw new Error("No tone change data returned from server");
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

export function useGetRecommendations(coverLetterId: string) {
  return useQuery({
    queryKey: ["recommendations", coverLetterId],
    queryFn: async () => {
      const response = await ApiClient.get<{
        success: boolean;
        data: Array<{ title: string; description: string }>;
      }>(`/cover-letters/${coverLetterId}/recommendations`);

      if (!response.data) {
        throw new Error("No recommendations data returned from server");
      }

      return response.data;
    },
    enabled: !!coverLetterId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useRegenerateWithTone(coverLetterId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ["regenerateWithTone", coverLetterId],
    mutationFn: async ({ tone }: { tone: string }) => {
      const response = await ApiClient.post<{
        success: boolean;
        data: CoverLetter;
      }>(`/cover-letters/${coverLetterId}/ai/regenerate-with-tone`, {
        tone,
      });

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
