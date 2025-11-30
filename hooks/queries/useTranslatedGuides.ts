"use client";

import { useQueries } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import { queryKeys, type TranslatedGuideResponse } from "./useGovGuidesQueries";

export function useTranslatedGuides(
  slugs: string[],
  language: "en" | "fil",
  enabled: boolean = true,
) {
  const queries = useQueries({
    queries: slugs.map((slug) => ({
      queryKey: queryKeys.govGuides.translation(slug, language),
      queryFn: () =>
        ApiClient.get<TranslatedGuideResponse>(
          `/guides/public/${slug}/translate?lang=${language}`,
        ),
      enabled: enabled && language === "fil" && !!slug,
      staleTime: 30 * 60 * 1000,
      gcTime: 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    })),
  });

  const translationsMap = new Map<string, TranslatedGuideResponse>();
  const isLoading = queries.some((q) => q.isLoading);
  const hasErrors = queries.some((q) => q.isError);

  queries.forEach((query, index) => {
    if (query.data) {
      translationsMap.set(slugs[index], query.data);
    }
  });

  return {
    translationsMap,
    isLoading,
    hasErrors,
  };
}
