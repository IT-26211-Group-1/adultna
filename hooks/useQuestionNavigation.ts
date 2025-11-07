import { useState, useCallback, useMemo } from "react";
import type { SessionQuestion } from "@/types/interview-question";

type NavigationProgress = {
  current: number;
  total: number;
  percentage: number;
};

type QuestionNavigationReturn = {
  currentIndex: number;
  currentQuestion: SessionQuestion | null;
  progress: NavigationProgress;
  canGoPrevious: boolean;
  canGoNext: boolean;
  isFirstQuestion: boolean;
  isLastQuestion: boolean;
  goNext: () => Promise<void>;
  goPrevious: () => Promise<void>;
  skip: () => void;
  goToQuestion: (index: number) => Promise<void>;
};

export function useQuestionNavigation(
  sessionQuestions: SessionQuestion[],
  onBeforeNavigate?: () => void | Promise<void>,
  initialIndex: number = 0,
): QuestionNavigationReturn {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const orderedQuestions = useMemo(() => {
    const general = sessionQuestions
      .filter((q) => q.isGeneral)
      .sort((a, b) => a.order - b.order);
    const specific = sessionQuestions
      .filter((q) => !q.isGeneral)
      .sort((a, b) => a.order - b.order);

    return [...general, ...specific];
  }, [sessionQuestions]);

  const currentQuestion = orderedQuestions[currentIndex] || null;
  const totalQuestions = orderedQuestions.length;

  const progress = useMemo<NavigationProgress>(
    () => ({
      current: currentIndex + 1,
      total: totalQuestions,
      percentage:
        totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0,
    }),
    [currentIndex, totalQuestions],
  );

  const isFirstQuestion = currentIndex === 0;
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const canGoPrevious = !isFirstQuestion;
  const canGoNext = !isLastQuestion;

  const goNext = useCallback(async () => {
    if (canGoNext) {
      if (onBeforeNavigate) {
        await onBeforeNavigate();
      }
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoNext, onBeforeNavigate]);

  const goPrevious = useCallback(async () => {
    if (canGoPrevious) {
      if (onBeforeNavigate) {
        await onBeforeNavigate();
      }
      setCurrentIndex((prev) => prev - 1);
    }
  }, [canGoPrevious, onBeforeNavigate]);

  const skip = useCallback(() => {
    if (canGoNext) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [canGoNext]);

  const goToQuestion = useCallback(
    async (index: number) => {
      if (index >= 0 && index < totalQuestions) {
        if (onBeforeNavigate) {
          await onBeforeNavigate();
        }
        setCurrentIndex(index);
      }
    },
    [totalQuestions, onBeforeNavigate],
  );

  return {
    currentIndex,
    currentQuestion,
    progress,
    canGoPrevious,
    canGoNext,
    isFirstQuestion,
    isLastQuestion,
    goNext,
    goPrevious,
    skip,
    goToQuestion,
  };
}
