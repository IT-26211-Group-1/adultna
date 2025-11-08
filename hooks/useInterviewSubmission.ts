import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { addToast } from "@heroui/toast";
import { interviewStorage } from "@/utils/interviewStorage";

type SessionMetadata = {
  jobRole: string;
  totalQuestions: number;
  answeredQuestions: number;
};

type InterviewSubmissionReturn = {
  isSubmitting: boolean;
  error: string | null;
  submitInterview: (
    answerIds: string[],
    metadata: SessionMetadata,
    sessionId?: string,
  ) => Promise<void>;
};

export function useInterviewSubmission(): InterviewSubmissionReturn {
  const router = useRouter();
  const { setSecureItem } = useSecureStorage();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submitInterview = useCallback(
    async (
      answerIds: string[],
      metadata: SessionMetadata,
      sessionId?: string,
    ) => {
      if (answerIds.length === 0) {
        addToast({
          title: "No answers were graded",
          description: "Please try answering the questions again.",
          color: "warning",
        });

        return;
      }

      setIsSubmitting(true);
      setError(null);

      try {
        const resultsData = {
          ...metadata,
          answerIds,
          timestamp: new Date().toISOString(),
        };

        setSecureItem(
          "interview_results",
          JSON.stringify(resultsData),
          60 * 24,
        );

        addToast({
          title: "Interview completed!",
          description: `Successfully graded ${answerIds.length} answers`,
          color: "success",
        });

        // Clear interview answers from localStorage before navigation
        // This prevents old answers from appearing if the user starts a new session
        if (sessionId) {
          interviewStorage.clear(sessionId);
        }

        router.push("/mock-interview/results");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";

        setError(errorMessage);
        addToast({
          title: "Failed to complete interview. Please try again.",
          color: "danger",
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [router, setSecureItem],
  );

  return {
    isSubmitting,
    error,
    submitInterview,
  };
}
