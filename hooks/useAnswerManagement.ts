import { useState, useCallback, useEffect } from "react";
import { interviewStorage } from "@/utils/interviewStorage";
import { useSubmitAnswer } from "@/hooks/queries/useInterviewAnswers";

type AnswerManagementReturn = {
  answers: Map<string, string>;
  currentAnswer: string;
  submittedAnswerIds: Map<string, string>;
  lastSavedAt: Date | null;
  setCurrentAnswer: (answer: string) => void;
  saveCurrentAnswer: (questionId: string) => void;
  submitForGrading: (questionId: string, questionText: string) => Promise<string | null>;
  clearSession: (sessionId: string) => void;
  loadAnswerForQuestion: (questionId: string) => void;
};

export function useAnswerManagement(sessionId: string) {
  const { mutateAsync: submitAnswer } = useSubmitAnswer();

  const [answers, setAnswers] = useState<Map<string, string>>(() =>
    interviewStorage.load(sessionId)
  );

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [submittedAnswerIds, setSubmittedAnswerIds] = useState<Map<string, string>>(
    new Map()
  );

  const saveCurrentAnswer = useCallback(
    (questionId: string) => {
      if (currentAnswer.trim()) {
        const updatedAnswers = new Map(answers).set(questionId, currentAnswer.trim());
        setAnswers(updatedAnswers);
        interviewStorage.save(sessionId, updatedAnswers);
        setLastSavedAt(new Date());
      }
    },
    [currentAnswer, answers, sessionId]
  );

  const submitForGrading = useCallback(
    async (questionId: string, questionText: string): Promise<string | null> => {
      const answer = currentAnswer.trim();

      if (!answer || submittedAnswerIds.has(questionId)) {
        return null;
      }

      try {
        const gradedAnswer = await submitAnswer({
          sessionQuestionId: questionId,
          userAnswer: answer,
        });

        setSubmittedAnswerIds((prev) => new Map(prev).set(questionId, gradedAnswer.id));

        return gradedAnswer.id;
      } catch (error) {
        console.error("Background grading failed:", error);
        return null;
      }
    },
    [currentAnswer, submittedAnswerIds, submitAnswer]
  );

  const clearSession = useCallback(
    (sessionId: string) => {
      interviewStorage.clear(sessionId);
      setAnswers(new Map());
      setCurrentAnswer("");
      setSubmittedAnswerIds(new Map());
      setLastSavedAt(null);
    },
    []
  );

  const loadAnswerForQuestion = useCallback(
    (questionId: string) => {
      const savedAnswer = answers.get(questionId) || "";
      setCurrentAnswer(savedAnswer);
    },
    [answers]
  );

  return {
    answers,
    currentAnswer,
    submittedAnswerIds,
    lastSavedAt,
    setCurrentAnswer,
    saveCurrentAnswer,
    submitForGrading,
    clearSession,
    loadAnswerForQuestion,
  };
}
