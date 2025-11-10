"use client";

import { useMutation } from "@tanstack/react-query";
import { ApiClient } from "@/lib/apiClient";
import {
  GenerateWorkDescriptionInput,
  GenerateWorkDescriptionResponse,
  GenerateSkillsSuggestionsInput,
  GenerateSkillsSuggestionsResponse,
} from "@/types/ai";

export function useGenerateWorkDescriptionSuggestions(resumeId: string) {
  return useMutation({
    mutationFn: async (data: GenerateWorkDescriptionInput) => {
      const response = await ApiClient.post<GenerateWorkDescriptionResponse>(
        `/resumes/${resumeId}/ai/work-description-suggestions`,
        data,
      );

      return response.suggestions || [];
    },
  });
}

export function useGenerateSkillsSuggestions(resumeId: string) {
  return useMutation({
    mutationFn: async (data: GenerateSkillsSuggestionsInput) => {
      const response = await ApiClient.post<GenerateSkillsSuggestionsResponse>(
        `/resumes/${resumeId}/ai/skills-suggestions`,
        data,
      );

      return response.suggestions || [];
    },
  });
}
