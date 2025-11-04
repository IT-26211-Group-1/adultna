import { useState, useEffect, useCallback, useMemo } from "react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import type { SessionQuestion } from "@/types/interview-question";

export type Step = "field" | "jobRole" | "guidelines" | "questions";

export type MockInterviewState = {
  currentStep: Step;
  selectedField: string | null;
  selectedJobRole: string | null;
  sessionId: string | null;
  sessionQuestions: SessionQuestion[];
  currentQuestionIndex: number;
};

type MockInterviewActions = {
  selectField: (fieldId: string) => void;
  selectJobRole: (jobRole: string) => void;
  startQuestions: (sessionId: string, questions: SessionQuestion[]) => void;
  setCurrentQuestionIndex: (index: number) => void;
  goToStep: (step: Step) => void;
  goBack: () => void;
  reset: () => void;
};

const STORAGE_KEY = "mock_interview_state";
const EXPIRY_MINUTES = 60;

const DEFAULT_STATE: MockInterviewState = {
  currentStep: "field",
  selectedField: null,
  selectedJobRole: null,
  sessionId: null,
  sessionQuestions: [],
  currentQuestionIndex: 0,
};

export function useMockInterviewState() {
  const { getSecureItem, setSecureItem } = useSecureStorage();

  const [state, setState] = useState<MockInterviewState>(() => {
    if (typeof window === "undefined") return DEFAULT_STATE;

    const stored = getSecureItem(STORAGE_KEY);

    if (stored) {
      try {
        return JSON.parse(stored) as MockInterviewState;
      } catch {
        return DEFAULT_STATE;
      }
    }

    return DEFAULT_STATE;
  });

  useEffect(() => {
    setSecureItem(STORAGE_KEY, JSON.stringify(state), EXPIRY_MINUTES);
  }, [state, setSecureItem]);

  const selectField = useCallback((fieldId: string) => {
    setState((prev) => ({
      ...prev,
      selectedField: fieldId,
      currentStep: "jobRole",
    }));
  }, []);

  const selectJobRole = useCallback((jobRole: string) => {
    setState((prev) => ({
      ...prev,
      selectedJobRole: jobRole,
      currentStep: "guidelines",
    }));
  }, []);

  const startQuestions = useCallback(
    (sessionId: string, questions: SessionQuestion[]) => {
      setState((prev) => ({
        ...prev,
        sessionId,
        sessionQuestions: questions,
        currentQuestionIndex: 0,
        currentStep: "questions",
      }));
    },
    [],
  );

  const setCurrentQuestionIndex = useCallback((index: number) => {
    setState((prev) => ({ ...prev, currentQuestionIndex: index }));
  }, []);

  const goToStep = useCallback((step: Step) => {
    setState((prev) => ({ ...prev, currentStep: step }));
  }, []);

  const goBack = useCallback(() => {
    setState((prev) => {
      switch (prev.currentStep) {
        case "jobRole":
          return {
            ...DEFAULT_STATE,
            currentStep: "field",
          };
        case "guidelines":
          return {
            ...prev,
            selectedJobRole: null,
            sessionId: null,
            sessionQuestions: [],
            currentStep: "jobRole",
          };
        case "questions":
          return {
            ...prev,
            currentQuestionIndex: 0,
            currentStep: "guidelines",
          };
        default:
          return prev;
      }
    });
  }, []);

  const reset = useCallback(() => {
    setState(DEFAULT_STATE);
  }, []);

  const actions: MockInterviewActions = useMemo(
    () => ({
      selectField,
      selectJobRole,
      startQuestions,
      setCurrentQuestionIndex,
      goToStep,
      goBack,
      reset,
    }),
    [
      selectField,
      selectJobRole,
      startQuestions,
      setCurrentQuestionIndex,
      goToStep,
      goBack,
      reset,
    ],
  );

  return { state, actions };
}
