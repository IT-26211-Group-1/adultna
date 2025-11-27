"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@heroui/react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { useGetAnswersByIds } from "@/hooks/queries/useInterviewAnswers";
import type { InterviewAnswer } from "@/types/interview-answer";
import ReactMarkdown from "react-markdown";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResultsLoadingSkeleton } from "./ResultsLoadingSkeleton";
import { StarMetricCards } from "./StarMetricCards";
import { QuestionBreakdown } from "./QuestionBreakdown";
import { useMockInterviewState } from "@/hooks/useMockInterviewState";
import { logger } from "@/lib/logger";

type SessionResults = {
  jobRole: string;
  totalQuestions: number;
  answeredQuestions: number;
  results: InterviewAnswer[];
  timestamp: string;
};

type StoredResultsData = {
  jobRole: string;
  totalQuestions: number;
  answeredQuestions: number;
  answerIds: string[];
  timestamp: string;
};

export function InterviewResults() {
  const router = useRouter();
  const { getSecureItem, removeSecureItem } = useSecureStorage();
  const { actions } = useMockInterviewState();
  const [answerIds, setAnswerIds] = useState<string[]>([]);
  const [sessionMetadata, setSessionMetadata] = useState<Omit<
    SessionResults,
    "results"
  > | null>(null);

  useEffect(() => {
    const resultsData = getSecureItem("interview_results");

    if (!resultsData) {
      router.push("/mock-interview");

      return;
    }

    try {
      const parsed: StoredResultsData = JSON.parse(resultsData);

      setAnswerIds(parsed.answerIds || []);
      setSessionMetadata({
        jobRole: parsed.jobRole,
        totalQuestions: parsed.totalQuestions,
        answeredQuestions: parsed.answeredQuestions,
        timestamp: parsed.timestamp,
      });
    } catch (error) {
      logger.error("Failed to parse results:", error);
      router.push("/mock-interview");

      return;
    }
  }, [getSecureItem, router]);

  const {
    data: gradedAnswers,
    isLoading,
    isError,
  } = useGetAnswersByIds(answerIds, answerIds.length > 0);

  if (
    !sessionMetadata ||
    isLoading ||
    (answerIds.length > 0 && !gradedAnswers)
  ) {
    return <ResultsLoadingSkeleton />;
  }

  if (gradedAnswers && gradedAnswers.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">No graded answers found.</p>
          <Button onClick={() => router.push("/mock-interview")}>
            Back to Mock Interview
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">
            Failed to load results. Please try again.
          </p>
          <Button onClick={() => router.push("/mock-interview")}>
            Back to Mock Interview
          </Button>
        </div>
      </div>
    );
  }

  if (!gradedAnswers || gradedAnswers.length === 0) {
    return <ResultsLoadingSkeleton />;
  }

  const averagePercentage =
    gradedAnswers.reduce(
      (sum, result) => sum + (result?.percentageScore || 0),
      0,
    ) / gradedAnswers.length;
  const scorePercentage = Math.round(averagePercentage);

  const averageScores = {
    starCompleteness:
      gradedAnswers.reduce(
        (sum, result) => sum + (result.scores?.starCompleteness || 0),
        0,
      ) / gradedAnswers.length,
    actionSpecificity:
      gradedAnswers.reduce(
        (sum, result) => sum + (result.scores?.actionSpecificity || 0),
        0,
      ) / gradedAnswers.length,
    resultQuantification:
      gradedAnswers.reduce(
        (sum, result) => sum + (result.scores?.resultQuantification || 0),
        0,
      ) / gradedAnswers.length,
    relevanceToRole:
      gradedAnswers.reduce(
        (sum, result) => sum + (result.scores?.relevanceToRole || 0),
        0,
      ) / gradedAnswers.length,
    deliveryFluency:
      gradedAnswers.reduce(
        (sum, result) => sum + (result.scores?.deliveryFluency || 0),
        0,
      ) / gradedAnswers.length,
  };
  const scoreLabel =
    scorePercentage >= 80
      ? "Good!"
      : scorePercentage >= 60
        ? "Fair"
        : "Needs Improvement";

  const allStrengths = gradedAnswers.flatMap(
    (result) => result.evaluation?.strengths || [],
  );
  const uniqueStrengths = Array.from(new Set(allStrengths)).slice(0, 4);

  const allFeedback = gradedAnswers
    .map(
      (result, index) =>
        `**Question ${index + 1}:**\n${result.evaluation?.starFeedback.overall || "No feedback available"}`,
    )
    .join("\n\n");
  const verdict = allFeedback;

  const handleRetake = () => {
    // Resets the states so it does not skip to the last part
    removeSecureItem("interview_results");
    actions.reset();
    router.push("/mock-interview");
  };

  const breadcrumbItems = [
    { label: "Dashboard", href: "/dashboard" },
    { label: "Mock Interview", href: "/mock-interview" },
    { label: sessionMetadata.jobRole, href: "/mock-interview" },
    { label: "Results", current: true },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header with Breadcrumbs */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <Breadcrumb items={breadcrumbItems} />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section - Celebration */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            Interview Complete
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            You&apos;re One Step Closer
            <br />
            <span className="text-adult-green">to the Real Thing!</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            You&apos;ve completed {sessionMetadata.answeredQuestions} out of{" "}
            {sessionMetadata.totalQuestions} questions — great job!
            Practicing your answers is a key step toward showing up confident.
          </p>
        </div>

        {/* Score Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 md:p-12 border border-gray-100">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Your Overall Score
              </h2>

              {/* Enhanced Score Gauge */}
              <div className="relative w-80 h-40 mx-auto mb-8">
                <svg className="w-full h-full" viewBox="0 0 320 160">
                  {/* Background Arc */}
                  <path
                    d="M 40 160 A 120 120 0 0 1 280 160"
                    fill="none"
                    stroke="#F3F4F6"
                    strokeLinecap="round"
                    strokeWidth="24"
                  />
                  {/* Colored Arc */}
                  <path
                    d="M 40 160 A 120 120 0 0 1 280 160"
                    fill="none"
                    stroke="url(#scoreGradient)"
                    strokeDasharray={`${(scorePercentage / 100) * 377} 377`}
                    strokeLinecap="round"
                    strokeWidth="24"
                    style={{
                      transition: "stroke-dasharray 1.5s ease-out",
                    }}
                  />
                  <defs>
                    <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#10B981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                  </defs>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-6xl font-bold text-gray-900 mb-2">
                    {scorePercentage}%
                  </div>
                  <p className="text-xl font-semibold text-adult-green">
                    {scoreLabel}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <Button
                  className="flex-1 bg-adult-green text-white hover:bg-adult-green/90 font-semibold text-base py-6"
                  size="lg"
                  onPress={handleRetake}
                >
                  Practice Again
                </Button>
                <Button
                  className="flex-1 border-2 border-gray-200 bg-white text-gray-700 hover:bg-gray-50 font-semibold text-base py-6"
                  size="lg"
                  variant="bordered"
                  onPress={() => router.push("/dashboard")}
                >
                  Dashboard
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Performance Breakdown
          </h2>
          <StarMetricCards
            actionSpecificity={
              Math.round(averageScores.actionSpecificity * 10) / 10
            }
            deliveryFluency={
              Math.round(averageScores.deliveryFluency * 10) / 10
            }
            relevanceToRole={
              Math.round(averageScores.relevanceToRole * 10) / 10
            }
            resultQuantification={
              Math.round(averageScores.resultQuantification * 10) / 10
            }
            starCompleteness={
              Math.round(averageScores.starCompleteness * 10) / 10
            }
          />
        </div>

        {/* Strengths & Feedback */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* What's Working Well */}
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                What&apos;s Working Well
              </h3>
            </div>
            <ul className="space-y-3">
              {uniqueStrengths.length > 0 ? (
                uniqueStrengths.map((strength, index) => (
                  <li
                    key={index}
                    className="flex items-start gap-3 text-gray-800"
                  >
                    <span className="text-green-500 mt-1">•</span>
                    <span className="font-medium">{strength}</span>
                  </li>
                ))
              ) : (
                <li className="text-gray-600 italic">
                  Complete more questions to see detailed feedback
                </li>
              )}
            </ul>
          </div>

          {/* Areas for Growth */}
          <div className="bg-blue-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Areas for Growth
              </h3>
            </div>
            <div className="text-gray-800 leading-relaxed">
              <div className="prose prose-sm max-w-none">
                <ReactMarkdown
                  components={{
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    p: ({ children }) => (
                      <p className="mb-3 last:mb-0 text-sm">{children}</p>
                    ),
                    h2: ({ children }) => (
                      <h4 className="text-sm font-bold text-gray-900 mt-3 mb-1">
                        {children}
                      </h4>
                    ),
                  }}
                >
                  {verdict}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Question-by-Question Breakdown */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Question-by-Question Analysis
          </h2>
          <QuestionBreakdown answers={gradedAnswers} />
        </div>
      </div>
    </div>
  );
}
