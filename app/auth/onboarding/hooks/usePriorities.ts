"use client";

import { useCallback } from "react";
import { usePrioritiesQuestion } from "@/hooks/queries/useOnboardingQueries";

interface Priority {
  questionId: number;
  optionId: number;
}

export function usePriorities() {
  const { question: prioritiesQuestion, isLoading: loading, error, refetch } = usePrioritiesQuestion();

  const isSelected = useCallback(
    (optionId: number, selectedPriorities: Priority[]) =>
      selectedPriorities.some((priority) => priority.optionId === optionId),
    []
  );

  const createSelectHandler = useCallback(
    (questionId: number, optionId: number) => ({
      questionId,
      optionId,
    }),
    []
  );

  const togglePriority = useCallback(
    (
      questionId: number,
      optionId: number,
      selectedPriorities: Priority[],
      setSelectedPriorities: (priorities: Priority[]) => void
    ) => {
      const existingIndex = selectedPriorities.findIndex(
        (priority) => priority.optionId === optionId
      );

      if (existingIndex >= 0) {
        // Remove if already selected
        setSelectedPriorities(
          selectedPriorities.filter((_, index) => index !== existingIndex)
        );
      } else {
        // Add if not selected
        setSelectedPriorities([
          ...selectedPriorities,
          { questionId, optionId },
        ]);
      }
    },
    []
  );

  return {
    prioritiesQuestion,
    loading,
    error,
    isSelected,
    createSelectHandler,
    togglePriority,
    refetch,
  };
}