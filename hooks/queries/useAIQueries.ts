"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import {
  GenerateWorkDescriptionInput,
  GenerateWorkDescriptionResponse,
} from "@/types/ai";

export function useGenerateWorkDescriptionSuggestions(resumeId: string) {
  return useMutation({
    mutationFn: async (data: GenerateWorkDescriptionInput) => {
      const response = await ApiClient.post<GenerateWorkDescriptionResponse>(
        `/resumes/${resumeId}/ai/work-description-suggestions`,
        data
      );
      return response.suggestions || [];
    },
  });
}
