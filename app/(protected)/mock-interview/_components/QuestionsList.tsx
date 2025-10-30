"use client";

import React, { memo, useMemo, useState } from "react";
import { useTextToSpeechAudio } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { useAudioPlayer } from "@/hooks/useAudioPlayer";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import type { SessionQuestion } from "@/types/interview-question";
import { AutoPlayToggle } from "./AutoPlayToggle";

type QuestionsListProps = {
  selectedIndustry: string;
  selectedJobRole: string;
  sessionId: string;
  sessionQuestions: SessionQuestion[];
  onBack: () => void;
};

// Category labels (constant, no need to recreate)
const CATEGORY_LABELS: Record<string, string> = {
  behavioral: "Behavioral Questions",
  technical: "Technical Questions",
  situational: "Situational Questions",
  background: "Background Questions",
};

export const QuestionsList = memo(function QuestionsList({
  selectedJobRole,
  sessionQuestions,
  onBack,
}: QuestionsListProps) {
  const { getSecureItem, setSecureItem } = useSecureStorage();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(() => {
    const saved = getSecureItem("interview_tts_muted");

    return saved === "true";
  });

  const { play, stop, isPlaying } = useAudioPlayer();

  // Get ordered questions (general first, then specific)
  const orderedQuestions = useMemo(() => {
    const general = sessionQuestions
      .filter((q) => q.isGeneral)
      .sort((a, b) => a.order - b.order);
    const specific = sessionQuestions
      .filter((q) => !q.isGeneral)
      .sort((a, b) => a.order - b.order);

    return [...general, ...specific];
  }, [sessionQuestions]);

  const currentQuestion = orderedQuestions[currentQuestionIndex];

  // Fetch audio for current question using reusable TTS API
  const shouldFetch = !isMuted && !!currentQuestion;
  const { audioUrl, isLoadingAudio } = useTextToSpeechAudio(
    currentQuestion?.question || "",
    shouldFetch,
  );

  // Auto-play when audio is ready and not muted
  React.useEffect(() => {
    if (audioUrl && !isMuted && currentQuestion) {
      const timeout = setTimeout(async () => {
        try {
          await play(audioUrl);
        } catch {
          console.warn(
            "Auto-play blocked by browser. User interaction required.",
          );
        }
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [audioUrl, isMuted, currentQuestion, play]);

  const totalQuestions = orderedQuestions.length;
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const toggleMute = () => {
    const newMuted = !isMuted;

    setIsMuted(newMuted);
    setSecureItem("interview_tts_muted", String(newMuted), 60 * 24 * 30); // 30 days expiry
    if (newMuted && isPlaying) {
      stop();
    }
  };

  const handleNextQuestion = () => {
    if (!isLastQuestion) {
      stop();
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (!isFirstQuestion) {
      stop();
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (sessionQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <button
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
          onClick={onBack}
        >
          ← Back to Guidelines
        </button>
        <h2 className="text-2xl font-semibold">Interview Questions</h2>
        <div className="text-center py-8 text-gray-500">
          No questions found for this session. Please go back and try again.
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header with Back Button and Mute Toggle */}
        <div className="flex items-center justify-between mb-6">
          <button
            className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
            onClick={onBack}
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 19l-7-7 7-7"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
              />
            </svg>
            {selectedJobRole}
          </button>

          {/* Auto-play Toggle */}
          <AutoPlayToggle
            isMuted={isMuted}
            isReady={!isLoadingAudio}
            onToggle={toggleMute}
          />
        </div>

        {/* Main Card Container */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header with green accent */}
          <div className="h-2 bg-adult-green" />

          {/* Content */}
          <div className="p-8">
            {/* Progress Indicator */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {currentQuestionIndex + 1} of {totalQuestions}
                </span>
                <span className="text-adult-green font-medium">
                  {currentQuestion?.isGeneral
                    ? "General Question"
                    : "Role-Specific Question"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-adult-green h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${((currentQuestionIndex + 1) / totalQuestions) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* Current Question */}
            {currentQuestion && (
              <div className="space-y-6">
                {/* Question Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {CATEGORY_LABELS[currentQuestion.category] ||
                        currentQuestion.category}
                    </h3>
                    {/* Audio Loading Indicator */}
                    {isLoadingAudio && (
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <svg
                          className="h-4 w-4 animate-spin"
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
                        Loading audio...
                      </div>
                    )}
                    {/* Playing Indicator */}
                    {isPlaying && !isLoadingAudio && (
                      <div className="flex items-center gap-1 text-xs text-adult-green">
                        <svg
                          className="h-4 w-4"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M8 5v14l11-7z" />
                        </svg>
                        Playing...
                      </div>
                    )}
                  </div>
                  <button className="text-sm text-gray-600 hover:text-gray-900 font-medium">
                    Show Timer
                  </button>
                </div>

                {/* Question Text */}
                <p className="text-xl text-gray-900 leading-relaxed font-medium">
                  {currentQuestion.question}
                </p>

                {/* Input Area */}
                <div className="space-y-2">
                  <p className="text-sm italic text-gray-600">
                    You can type your answer or try speaking out loud using your
                    mic.
                  </p>
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adult-green focus:border-transparent resize-none"
                      placeholder="Type your answer here..."
                      rows={6}
                    />
                  </div>
                </div>

                {/* Navigation Buttons */}
                <div className="flex items-center justify-between pt-6">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      isFirstQuestion
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    disabled={isFirstQuestion}
                    onClick={handlePreviousQuestion}
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M15 19l-7-7 7-7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                      />
                    </svg>
                    Previous
                  </button>

                  {isLastQuestion ? (
                    <button className="px-6 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors font-medium">
                      Finish Interview
                    </button>
                  ) : (
                    <button
                      className="flex items-center gap-2 px-6 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors font-medium"
                      onClick={handleNextQuestion}
                    >
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
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});
