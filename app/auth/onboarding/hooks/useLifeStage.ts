"use client";

import { useCallback } from "react";
import { useLifeStageQuestion } from "@/hooks/queries/useOnboardingQueries";

interface LifeStageSelection {
  questionId: number;
  optionId: number;
}

export function useLifeStage() {
  const {
    question: lifeStageQuestion,
    isLoading: loading,
    error,
    refetch,
  } = useLifeStageQuestion();

  const isSelected = useCallback(
    (
      optionId: number,
      questionId: number,
      selectedLifeStage: LifeStageSelection | null,
    ) =>
      selectedLifeStage?.optionId === optionId &&
      selectedLifeStage?.questionId === questionId,
    [],
  );

  const createSelectHandler = useCallback(
    (questionId: number, optionId: number) => ({
      questionId,
      optionId,
    }),
    [],
  );

  return {
    lifeStageQuestion,
    loading,
    error,
    isSelected,
    createSelectHandler,
    refetch,
  };
}
