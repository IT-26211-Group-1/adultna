"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import { logger } from "@/lib/logger";

// Types
export type GuideStatus = "pending" | "accepted" | "rejected" | "to_revise";

export type GuideCategory =
  | "identification"
  | "civil-registration"
  | "permits-licenses"
  | "social-services"
  | "tax-related"
  | "legal"
  | "other";

export type ProcessStep = {
  stepNumber: number;
  title: string;
  description?: string;
  estimatedTime?: string;
};

export type DocumentRequirement = {
  name: string;
  description?: string;
  isRequired?: boolean;
};

export type OfficeInfo = {
  issuingAgency: string;
  locations?: string[];
  feeAmount?: number;
  feeCurrency?: string;
  oneTimeFee?: boolean;
};

export type GeneralTips = {
  tipsToFollow?: string[];
  tipsToAvoid?: string[];
  importantReminders?: string[];
};

export type Guide = {
  id: string;
  title: string;
  slug: string;
  category: GuideCategory;
  customCategory: string | null;
  description: string;
  keywords: string[];
  steps: ProcessStep[];
  requirements: DocumentRequirement[];
  processingTime: string;
  offices: OfficeInfo;
  generalTips?: GeneralTips | null;
  status: GuideStatus;
  createdBy: string;
  verifiedBy: string | null;
  updatedBy: string | null;
  rejectionReason: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
};

export type CreateGuideRequest = {
  title: string;
  category: GuideCategory;
  customCategory?: string | null;
  description: string;
  keywords: string[];
  steps: ProcessStep[];
  requirements: DocumentRequirement[];
  processingTime: string;
  offices: OfficeInfo;
  generalTips?: GeneralTips;
};

export type CreateGuideResponse = {
  success: boolean;
  message: string;
  data?: Guide;
};

export type UpdateGuideRequest = {
  title?: string;
  category?: GuideCategory;
  customCategory?: string | null;
  description?: string;
  keywords?: string[];
  steps?: ProcessStep[];
  requirements?: DocumentRequirement[];
  processingTime?: string;
  offices?: OfficeInfo;
  generalTips?: GeneralTips;
};

export type UpdateGuideResponse = {
  success: boolean;
  message: string;
  guide?: Guide;
};

export type VerifyGuideRequest = {
  action: "approve" | "reject" | "revise";
  reason?: string;
};

export type VerifyGuideResponse = {
  success: boolean;
  message: string;
  guide?: Guide;
};

export type DeleteGuideResponse = {
  success: boolean;
  message: string;
};

export type GuidesListResponse = {
  success: boolean;
  message: string;
  data: {
    guides: Guide[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

export type GuideDetailResponse = {
  success: boolean;
  message: string;
  guide: Guide;
};

// API Functions
const guidesApi = {
  // List all guides (admin only)
  listGuides: (params?: {
    category?: GuideCategory;
    status?: GuideStatus;
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<GuidesListResponse> => {
    const queryParams = new URLSearchParams();

    if (params?.category) queryParams.append("category", params.category);
    if (params?.status) queryParams.append("status", params.status);
    if (params?.search) queryParams.append("search", params.search);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();

    return ApiClient.get(`/guides/view${queryString ? `?${queryString}` : ""}`);
  },

  // Get guide by ID (admin only)
  getGuideById: (guideId: string): Promise<GuideDetailResponse> =>
    ApiClient.get(`/guides/view/${guideId}`),

  // Create guide
  createGuide: (data: CreateGuideRequest): Promise<CreateGuideResponse> =>
    ApiClient.post("/guides/create", data),

  // Update guide
  updateGuide: (
    guideId: string,
    data: UpdateGuideRequest,
  ): Promise<UpdateGuideResponse> =>
    ApiClient.put(`/guides/update/${guideId}`, data),

  // Verify guide (approve/reject/revise)
  verifyGuide: (
    guideId: string,
    data: VerifyGuideRequest,
  ): Promise<VerifyGuideResponse> =>
    ApiClient.put(`/guides/verify/${guideId}`, data),

  // Soft delete guide
  softDeleteGuide: (guideId: string): Promise<DeleteGuideResponse> =>
    ApiClient.delete(`/guides/delete/${guideId}`),

  // Hard delete guide (permanent)
  hardDeleteGuide: (guideId: string): Promise<DeleteGuideResponse> =>
    ApiClient.delete(`/guides/delete/${guideId}/permanent`),

  // Restore guide
  restoreGuide: (guideId: string): Promise<DeleteGuideResponse> =>
    ApiClient.post(`/guides/restore/${guideId}`, {}),
};

// Custom Hook
export function useGuidesQueries() {
  const queryClient = useQueryClient();

  // List guides query
  const useListGuides = (params?: {
    category?: GuideCategory;
    status?: GuideStatus;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    return useQuery({
      queryKey: ["admin", "guides", "list", params],
      queryFn: () => guidesApi.listGuides(params),
      staleTime: 2 * 60 * 1000, // 2 minutes
      gcTime: 5 * 60 * 1000, // 5 minutes
    });
  };

  // Get guide by ID query
  const useGetGuide = (guideId: string, enabled: boolean = true) => {
    return useQuery({
      queryKey: ["admin", "guides", "detail", guideId],
      queryFn: () => guidesApi.getGuideById(guideId),
      enabled: enabled && !!guideId,
      staleTime: 2 * 60 * 1000,
      gcTime: 5 * 60 * 1000,
    });
  };

  // Create guide mutation
  const createGuideMutation = useMutation({
    mutationFn: guidesApi.createGuide,
    onSuccess: (data) => {
      logger.info("Guide created successfully", { guide: data.data });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
    },
    onError: (error) => {
      logger.error("Failed to create guide", { error });
    },
  });

  // Update guide mutation
  const updateGuideMutation = useMutation({
    mutationFn: ({
      guideId,
      data,
    }: {
      guideId: string;
      data: UpdateGuideRequest;
    }) => guidesApi.updateGuide(guideId, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides", "detail", variables.guideId],
      });
    },
    onError: (error) => {
      logger.error("Failed to update guide", { error });
    },
  });

  // Verify guide mutation
  const verifyGuideMutation = useMutation({
    mutationFn: ({
      guideId,
      data,
    }: {
      guideId: string;
      data: VerifyGuideRequest;
    }) => guidesApi.verifyGuide(guideId, data),
    onSuccess: (data, variables) => {
      logger.info("Guide verified successfully", {
        guideId: variables.guideId,
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides", "detail", variables.guideId],
      });
    },
    onError: (error) => {
      logger.error("Failed to verify guide", { error });
    },
  });

  // Soft delete guide mutation
  const softDeleteGuideMutation = useMutation({
    mutationFn: (guideId: string) => guidesApi.softDeleteGuide(guideId),
    onSuccess: (data, guideId) => {
      logger.info("Guide soft deleted successfully", { guideId });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
    },
    onError: (error) => {
      logger.error("Failed to soft delete guide", { error });
    },
  });

  // Hard delete guide mutation
  const hardDeleteGuideMutation = useMutation({
    mutationFn: (guideId: string) => guidesApi.hardDeleteGuide(guideId),
    onSuccess: (data, guideId) => {
      logger.info("Guide permanently deleted", { guideId });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
    },
    onError: (error) => {
      logger.error("Failed to permanently delete guide", { error });
    },
  });

  // Restore guide mutation
  const restoreGuideMutation = useMutation({
    mutationFn: (guideId: string) => guidesApi.restoreGuide(guideId),
    onSuccess: (data, guideId) => {
      logger.info("Guide restored successfully", { guideId });
      queryClient.invalidateQueries({
        queryKey: ["admin", "guides"],
      });
    },
    onError: (error) => {
      logger.error("Failed to restore guide", { error });
    },
  });

  return {
    useListGuides,
    useGetGuide,
    createGuide: createGuideMutation.mutate,
    createGuideAsync: createGuideMutation.mutateAsync,
    isCreatingGuide: createGuideMutation.isPending,
    updateGuide: updateGuideMutation.mutate,
    updateGuideAsync: updateGuideMutation.mutateAsync,
    isUpdatingGuide: updateGuideMutation.isPending,
    verifyGuide: verifyGuideMutation.mutate,
    verifyGuideAsync: verifyGuideMutation.mutateAsync,
    isVerifyingGuide: verifyGuideMutation.isPending,
    softDeleteGuide: softDeleteGuideMutation.mutate,
    softDeleteGuideAsync: softDeleteGuideMutation.mutateAsync,
    isSoftDeletingGuide: softDeleteGuideMutation.isPending,
    hardDeleteGuide: hardDeleteGuideMutation.mutate,
    hardDeleteGuideAsync: hardDeleteGuideMutation.mutateAsync,
    isHardDeletingGuide: hardDeleteGuideMutation.isPending,
    restoreGuide: restoreGuideMutation.mutate,
    restoreGuideAsync: restoreGuideMutation.mutateAsync,
    isRestoringGuide: restoreGuideMutation.isPending,
  };
}
