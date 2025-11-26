"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient, queryKeys as baseQueryKeys } from "@/lib/apiClient";
import type { GovGuide, GuideStatus, GuideCategory } from "@/types/govguide";

export type ListGuidesResponse = {
  success: boolean;
  guides: GovGuide[];
  total: number;
  message?: string;
};

export type GetGuideResponse = {
  success: boolean;
  guide: GovGuide;
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
    const endpoint = `/guides/public${queryString ? `?${queryString}` : ""}`;

    return ApiClient.get(endpoint);
  },

  getGuide: (id: string): Promise<GetGuideResponse> =>
    ApiClient.get(`/guides/public/${id}`),
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
