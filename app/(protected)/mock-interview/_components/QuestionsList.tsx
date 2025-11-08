"use client";

import React, { memo, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useMockInterviewState } from "@/hooks/useMockInterviewState";
import { useQuestionNavigation } from "@/hooks/useQuestionNavigation";
import { useAnswerManagement } from "@/hooks/useAnswerManagement";
import { useInterviewAudio } from "@/hooks/useInterviewAudio";
import { useInterviewSubmission } from "@/hooks/useInterviewSubmission";
import type { SessionQuestion } from "@/types/interview-question";
import { AutoPlayToggle } from "./AutoPlayToggle";
import { Spinner } from "@heroui/react";
import { GradingProgressModal } from "@/components/ui/GradingProgressModal";
import { addToast } from "@heroui/toast";

type QuestionsListProps = {
  selectedIndustry: string;
  selectedJobRole: string;
  sessionId: string;
  sessionQuestions: SessionQuestion[];
  onBack: () => void;
};

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
  sessionId,
}: QuestionsListProps) {
  const { user } = useAuth();
  const userId = (user as any)?.userId || "";

  const { state, actions } = useMockInterviewState();

  const [gradingProgress, setGradingProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [isGrading, setIsGrading] = useState(false);

  const {
    answers,
    currentAnswer,
    submittedAnswerIds,
    lastSavedAt,
    setCurrentAnswer,
    saveCurrentAnswer,
    submitForGrading,
    loadAnswerForQuestion,
    clearSession,
  } = useAnswerManagement(sessionId);

  const handleBeforeNavigate = async () => {
    const question = navigation.currentQuestion;

    if (question) {
      saveCurrentAnswer(question.id);

      if (currentAnswer.trim() && !submittedAnswerIds.has(question.id)) {
        console.log(`[QuestionsList] Submitting and grading answer: ${question.id}`);

        // Submit and grade immediately (synchronous grading with Bedrock)
        const result = await submitForGrading(question.id, question.question);

        if (result) {
          console.log(`[QuestionsList] ✅ Answer ${result} graded successfully`);
        }
      }
    }
    audio.tts.stop();
    audio.stt.stopRealtimeRecognition();
  };

  const navigation = useQuestionNavigation(
    sessionQuestions,
    handleBeforeNavigate,
    state.currentQuestionIndex,
  );

  useEffect(() => {
    if (state.currentQuestionIndex !== navigation.currentIndex) {
      actions.setCurrentQuestionIndex(navigation.currentIndex);
    }
  }, [
    navigation.currentIndex,
    state.currentQuestionIndex,
    actions.setCurrentQuestionIndex,
  ]);

  const audio = useInterviewAudio(
    navigation.currentQuestion?.question || "",
    userId,
    true,
  );

  const { isSubmitting, submitInterview } = useInterviewSubmission();

  useEffect(() => {
    if (navigation.currentQuestion) {
      loadAnswerForQuestion(navigation.currentQuestion.id);
    }
  }, [navigation.currentQuestion, loadAnswerForQuestion]);

  useEffect(() => {
    return () => {
      audio.stt.stopRealtimeRecognition();
    };
  }, [audio.stt]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (answers.size > 0 || currentAnswer.trim()) {
        e.preventDefault();
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [answers, currentAnswer]);

  const handleMicrophoneClick = async () => {
    if (audio.stt.isRecording) {
      audio.stt.stopRecording();
      audio.stt.stopRealtimeRecognition();
    } else {
      audio.stt.clearRecording();

      await audio.stt.startRealtimeRecognition((transcript) => {
        setCurrentAnswer(transcript);
      });

      await audio.stt.startRecording();
    }
  };

  useEffect(() => {
    if (audio.stt.audioBlob && !audio.stt.isRecording) {
      const transcribe = async () => {
        try {
          console.log("🎤 Starting AWS transcription...");
          const awsTranscript = await audio.stt.transcribeAndPoll(
            audio.stt.audioBlob!,
          );

          console.log("✅ AWS transcript received:", awsTranscript?.substring(0, 50));

          if (awsTranscript) {
            setCurrentAnswer(awsTranscript);
          }
          audio.stt.clearRecording();
        } catch (error) {
          console.error("❌ AWS transcription failed:", error);
          // Keep the Web Speech API result if AWS fails
        }
      };

      transcribe();
    }
  }, [audio.stt.audioBlob, audio.stt.isRecording]);

  const handleFinishInterview = async () => {
    let lastAnswerId: string | null = null;

    // Submit last answer to queue if not already submitted
    if (navigation.currentQuestion) {
      saveCurrentAnswer(navigation.currentQuestion.id);

      if (
        currentAnswer.trim() &&
        !submittedAnswerIds.has(navigation.currentQuestion.id)
      ) {
        lastAnswerId = await submitForGrading(
          navigation.currentQuestion.id,
          navigation.currentQuestion.question,
        );
      }
    }

    // Get all submitted answer IDs, including the last one if it was just submitted
    const gradedAnswerIds = lastAnswerId
      ? [...Array.from(submittedAnswerIds.values()), lastAnswerId]
      : Array.from(submittedAnswerIds.values());

    if (gradedAnswerIds.length === 0) {
      addToast({
        title: "No answers to grade",
        description: "Please answer at least one question.",
        color: "warning",
      });

      return;
    }

    // Show modal and wait for all answers to be graded
    setIsGrading(true);
    setGradingProgress(0);
    setCompletedCount(0);

    try {
      // Poll all answers until they're all graded
      const { pollMultipleAnswersUntilComplete } = await import(
        "@/hooks/queries/useInterviewAnswers"
      );

      await pollMultipleAnswersUntilComplete(
        gradedAnswerIds,
        (completed, total) => {
          setCompletedCount(completed);
          const progress = Math.round((completed / total) * 100);

          setGradingProgress(progress);
          console.log(
            `[QuestionsList] Grading progress: ${completed}/${total} (${progress}%)`,
          );
        },
      );

      clearSession(sessionId);
      actions.reset(); 

      // Navigate to results
      await submitInterview(
        gradedAnswerIds,
        {
          jobRole: selectedJobRole,
          totalQuestions: navigation.progress.total,
          answeredQuestions: gradedAnswerIds.length,
        },
        sessionId,
      );
    } catch (error) {
      console.error("[QuestionsList] Grading failed:", error);
      setIsGrading(false);

      addToast({
        title: "Grading failed",
        description:
          "Some answers could not be graded. Please try again later.",
        color: "danger",
      });
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

          <AutoPlayToggle
            isMuted={audio.tts.isMuted}
            isReady={!audio.tts.isLoadingAudio}
            onToggle={audio.tts.toggleMute}
          />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="h-2 bg-adult-green" />

          <div className="p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>
                  Question {navigation.progress.current} of{" "}
                  {navigation.progress.total}
                </span>
                <span className="text-adult-green font-medium">
                  {navigation.currentQuestion?.isGeneral
                    ? "General Question"
                    : "Role-Specific Question"}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-adult-green h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${navigation.progress.percentage}%`,
                  }}
                />
              </div>
              {lastSavedAt && (
                <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                  <svg
                    className="w-3 h-3 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fillRule="evenodd"
                    />
                  </svg>
                  Saved
                </div>
              )}
            </div>

            {navigation.currentQuestion && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {CATEGORY_LABELS[navigation.currentQuestion.category] ||
                        navigation.currentQuestion.category}
                    </h3>
                    {audio.tts.isLoadingAudio && (
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
                    {audio.tts.isPlaying && !audio.tts.isLoadingAudio && (
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
                </div>

                <p className="text-xl text-gray-900 leading-relaxed font-medium">
                  {navigation.currentQuestion.question}
                </p>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-sm italic text-gray-600">
                        You can type your answer or try speaking out loud using
                        your mic.
                      </p>
                      {audio.stt.isRecording && (
                        <div className="flex items-center gap-2 text-xs text-adult-green mt-1">
                          <svg
                            className="w-3 h-3 animate-pulse"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <circle cx="10" cy="10" r="8" />
                          </svg>
                          Recording... Your speech will be transcribed when you
                          stop.
                        </div>
                      )}
                    </div>
                    {audio.stt.recordingError && (
                      <p className="text-xs text-red-600">
                        {audio.stt.recordingError}
                      </p>
                    )}
                  </div>
                  <div className="relative">
                    <textarea
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adult-green focus:border-transparent resize-none"
                      disabled={audio.stt.isTranscribing || isSubmitting}
                      placeholder="Type your answer here..."
                      rows={6}
                      value={currentAnswer}
                      onChange={(e) => setCurrentAnswer(e.target.value)}
                    />
                    <button
                      className={`absolute right-3 bottom-3 p-2 rounded-full transition-colors ${
                        audio.stt.isRecording
                          ? "bg-red-500 text-white animate-pulse"
                          : audio.stt.isTranscribing
                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                            : "bg-adult-green/10 text-adult-green hover:bg-adult-green/20"
                      }`}
                      disabled={audio.stt.isTranscribing}
                      title={
                        audio.stt.isRecording
                          ? "Stop recording"
                          : audio.stt.isTranscribing
                            ? "Transcribing..."
                            : "Start recording"
                      }
                      onClick={handleMicrophoneClick}
                    >
                      {audio.stt.isTranscribing ? (
                        <svg
                          className="w-5 h-5 animate-spin"
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
                      ) : audio.stt.isRecording ? (
                        <svg
                          className="w-5 h-5"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <rect height="12" rx="2" width="12" x="4" y="4" />
                        </svg>
                      ) : (
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                          />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>
                      {currentAnswer.length} characters •{" "}
                      {currentAnswer.trim().split(/\s+/).length} words
                    </span>
                    <span
                      className={
                        currentAnswer.length < 150
                          ? "text-yellow-600"
                          : currentAnswer.length > 500
                            ? "text-yellow-600"
                            : "text-green-600"
                      }
                    >
                      {currentAnswer.length < 150
                        ? "Too short"
                        : currentAnswer.length > 500
                          ? "Getting long"
                          : "Good length"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-6">
                  <button
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                      navigation.isFirstQuestion || isSubmitting
                        ? "text-gray-400 cursor-not-allowed"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                    disabled={navigation.isFirstQuestion || isSubmitting}
                    onClick={navigation.goPrevious}
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

                  <div className="flex items-center gap-3">
                    {!navigation.isLastQuestion && (
                      <button
                        className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors font-medium"
                        disabled={isSubmitting}
                        onClick={navigation.skip}
                      >
                        Skip
                      </button>
                    )}

                    {navigation.isLastQuestion ? (
                      <button
                        className="px-6 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors font-medium flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={isSubmitting}
                        onClick={handleFinishInterview}
                      >
                        {isSubmitting ? (
                          <>
                            <Spinner color="white" size="sm" />
                            Evaluating your answers...
                          </>
                        ) : (
                          "Finish Interview"
                        )}
                      </button>
                    ) : (
                      <button
                        className="flex items-center gap-2 px-6 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors font-medium disabled:opacity-50"
                        disabled={isSubmitting}
                        onClick={navigation.goNext}
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
              </div>
            )}
          </div>
        </div>
      </div>

      <GradingProgressModal
        isOpen={isGrading}
        progress={gradingProgress}
        currentQuestion={completedCount}
        totalQuestions={submittedAnswerIds.size}
      />
    </div>
  );
});
