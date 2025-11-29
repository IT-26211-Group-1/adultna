import { useQuery } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import type { ProcessStep, DocumentRequirement, GeneralTips, OfficeInfo } from "@/types/govguide";

type TranslatedGuideResponse = {
  title: string;
  description: string;
  steps: ProcessStep[];
  requirements: DocumentRequirement[];
  generalTips: GeneralTips | null;
  offices: OfficeInfo;
};

export function useTranslatedGuide(slug: string, language: "en" | "fil") {
  return useQuery<TranslatedGuideResponse>({
    queryKey: ["guide", slug, "translated", language],
    queryFn: () => ApiClient.get(`/guides/public/${slug}/translate?lang=${language}`),
    enabled: !!slug && language === "fil",
    staleTime: 1000 * 60 * 30,
  });
}
