"use client";

import React, { memo, useEffect, useState } from "react";
import { useCreateInterviewSession } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { useTextToSpeech } from "@/hooks/useTextToSpeech";
import { useAuth } from "@/hooks/useAuth";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import type { SessionQuestion } from "@/types/interview-question";
import { AutoPlayToggle } from "./AutoPlayToggle";
import { logger } from "@/lib/logger";

type InterviewGuidelinesProps = {
  selectedIndustry: string;
  selectedJobRole: string;
  onNext: (sessionId: string, questions: SessionQuestion[]) => void;
};

export const InterviewGuidelines = memo(function InterviewGuidelines({
  selectedIndustry,
  selectedJobRole,
  onNext,
}: InterviewGuidelinesProps) {
  const guidelinesText = `Let's Get You Interview-Ready. You'll be asked 5 common interview questions based on the role you selected. There are no right or wrong answers — just a chance to reflect, improve, and grow.`;

  const { user } = useAuth();
  const { getSecureItem, setSecureItem } = useSecureStorage();
  const { createSessionAsync, isCreatingSession, createSessionError } =
    useCreateInterviewSession();

  const { speak, stop, isSpeaking, isReady } = useTextToSpeech();

  // Initialize mute state from storage
  const [isMuted, setIsMuted] = useState(() => {
    const saved = getSecureItem("interview_tts_muted");

    return saved === "true";
  });

  // Auto-speak when voice is ready and not muted
  useEffect(() => {
    if (isReady && !isMuted) {
      speak(guidelinesText);
    }
  }, [isReady, isMuted, speak, guidelinesText]);

  const handleToggleSpeech = () => {
    const newMuted = !isMuted;

    setIsMuted(newMuted);
    setSecureItem("interview_tts_muted", String(newMuted), 60 * 24 * 30); // 30 days expiry

    if (newMuted && isSpeaking) {
      stop();
    } else if (!newMuted) {
      speak(guidelinesText);
    }
  };

  const handleNextClick = async () => {
    const userId = user?.id;

    if (!userId) {
      logger.error("User not authenticated");

      return;
    }

    try {
      // Create interview session with 2 general + 3 role-specific questions
      const response = await createSessionAsync({
        userId,
        industry: selectedIndustry,
        jobRole: selectedJobRole,
      });

      if (response.success && response.data) {
        // Pass sessionId and questions to parent
        onNext(response.data.sessionId, response.data.questions);
      }
    } catch (error) {
      logger.error("Failed to create interview session:", error);
    }
  };

  return (
    <div className="min-h-[500px] flex flex-col">
      {/* Centered content */}
      <div className="flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto text-center space-y-6">
        <div className="flex items-center justify-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Let&apos;s Get You{" "}
            <span className="text-adult-green">Interview-Ready</span>
          </h1>
          <AutoPlayToggle
            isMuted={isMuted}
            isReady={isReady}
            onToggle={handleToggleSpeech}
          />
        </div>

        <p className="text-base text-gray-700">
          You&apos;ll be asked 5 common interview questions based on the role
          you selected.
        </p>

        <p className="text-sm text-gray-500 italic">
          There are no right or wrong answers — just a chance to reflect,
          improve, and grow.
        </p>

        {/* Error message if session creation fails */}
        {createSessionError && (
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
            Failed to create interview session. Please try again.
          </div>
        )}

        {/* Next button bottom right */}
        <div className="pt-8">
          <button
            className="px-6 py-3 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isCreatingSession || !user?.id}
            onClick={handleNextClick}
          >
            {isCreatingSession ? (
              <>
                <svg
                  className="h-5 w-5 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
                Next
              </>
            ) : (
              <>
                Next
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
});
