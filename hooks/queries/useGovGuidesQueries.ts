"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient, queryKeys as baseQueryKeys } from "@/lib/apiClient";
import { API_CONFIG } from "@/config/api";

export type GuideStatus = "pending" | "accepted" | "rejected" | "to_revise";

export type GuideCategory =
  | "identification"
  | "civil-registration"
  | "permits-licenses"
  | "social-services"
  | "tax-related"
  | "legal"
  | "other";

export type OfficeInfo = {
  issuingAgency: string;
  locations?: string[];
  feeAmount?: number;
  feeCurrency?: string;
  oneTimeFee?: boolean;
};

export type DocumentRequirement = {
  name: string;
  description?: string;
  isRequired?: boolean;
};

export type ProcessStep = {
  stepNumber: number;
  title: string;
  description?: string;
  estimatedTime?: string;
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

export type ListGuidesResponse = {
  success: boolean;
  guides: Guide[];
  total: number;
  message?: string;
};

export type GetGuideResponse = {
  success: boolean;
  guide: Guide;
  message?: string;
};

const govGuidesApi = {
  listGuides: (params?: {
    status?: GuideStatus;
    category?: GuideCategory;
  }): Promise<ListGuidesResponse> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append("status", params.status);
    if (params?.category) queryParams.append("category", params.category);

    const queryString = queryParams.toString();
    const endpoint = `/guides/view${queryString ? `?${queryString}` : ""}`;

    return ApiClient.get(endpoint);
  },

  getGuide: (id: string): Promise<GetGuideResponse> =>
    ApiClient.get(`/guides/view/${id}`),
};

export const queryKeys = {
  ...baseQueryKeys,
  govGuides: {
    all: ["govGuides"] as const,
    lists: () => [...queryKeys.govGuides.all, "list"] as const,
    list: (filters?: { status?: GuideStatus; category?: GuideCategory }) =>
      [...queryKeys.govGuides.lists(), filters] as const,
    details: () => [...queryKeys.govGuides.all, "detail"] as const,
    detail: (id: string) => [...queryKeys.govGuides.details(), id] as const,
  },
};

export function useGovGuides(params?: {
  status?: GuideStatus;
  category?: GuideCategory;
}) {
  const {
    data: guidesData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.govGuides.list(params),
    queryFn: () => govGuidesApi.listGuides(params),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    guides: guidesData?.guides || [],
    total: guidesData?.total || 0,
    guidesData,
    isLoading,
    error,
    refetch,
  };
}

export function useGovGuide(id: string) {
  const {
    data: guideData,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: queryKeys.govGuides.detail(id),
    queryFn: () => govGuidesApi.getGuide(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });

  return {
    guide: guideData?.guide,
    guideData,
    isLoading,
    error,
    refetch,
  };
}
