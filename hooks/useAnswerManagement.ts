import { useState, useCallback } from "react";
import { interviewStorage } from "@/utils/interviewStorage";
import { useSubmitAnswerToQueue } from "@/hooks/queries/useInterviewAnswers";

export function useAnswerManagement(sessionId: string) {
  const { mutateAsync: submitAnswerToQueue } = useSubmitAnswerToQueue();

  const [answers, setAnswers] = useState<Map<string, string>>(() =>
    interviewStorage.load(sessionId),
  );

  const [currentAnswer, setCurrentAnswer] = useState("");
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [submittedAnswerIds, setSubmittedAnswerIds] = useState<
    Map<string, string>
  >(new Map());

  const saveCurrentAnswer = useCallback(
    (questionId: string) => {
      if (currentAnswer.trim()) {
        const updatedAnswers = new Map(answers).set(
          questionId,
          currentAnswer.trim(),
        );

        setAnswers(updatedAnswers);
        interviewStorage.save(sessionId, updatedAnswers);
        setLastSavedAt(new Date());
      }
    },
    [currentAnswer, answers, sessionId],
  );

  const submitForGrading = useCallback(
    async (
      questionId: string,
      _questionText: string,
    ): Promise<string | null> => {
      const answer = currentAnswer.trim();

      if (!answer || submittedAnswerIds.has(questionId)) {
        return null;
      }

      try {
        // Submit to queue without waiting for grading to complete
        const pendingAnswer = await submitAnswerToQueue({
          sessionQuestionId: questionId,
          userAnswer: answer,
        });

        setSubmittedAnswerIds((prev) =>
          new Map(prev).set(questionId, pendingAnswer.id),
        );

        return pendingAnswer.id;
      } catch (error) {
        console.error("Background grading submission failed:", error);

        return null;
      }
    },
    [currentAnswer, submittedAnswerIds, submitAnswerToQueue],
  );

  const clearSession = useCallback((sessionId: string) => {
    interviewStorage.clear(sessionId);
    setAnswers(new Map());
    setCurrentAnswer("");
    setSubmittedAnswerIds(new Map());
    setLastSavedAt(null);
  }, []);

  const loadAnswerForQuestion = useCallback(
    (questionId: string) => {
      const savedAnswer = answers.get(questionId) || "";

      setCurrentAnswer(savedAnswer);
    },
    [answers],
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
