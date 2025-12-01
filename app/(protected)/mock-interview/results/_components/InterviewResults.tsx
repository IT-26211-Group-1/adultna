"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, lazy, Suspense } from "react";
import { Button } from "@heroui/react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { useGetAnswersByIds } from "@/hooks/queries/useInterviewAnswers";
import type { InterviewAnswer } from "@/types/interview-answer";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { ResultsLoadingSkeleton } from "./ResultsLoadingSkeleton";
import { useMockInterviewState } from "@/hooks/useMockInterviewState";
import { logger } from "@/lib/logger";

const GaugeComponent = lazy(() => import("react-gauge-component"));
const ReactMarkdown = lazy(() => import("react-markdown"));
const StarMetricCards = lazy(() => import("./StarMetricCards"));
const QuestionBreakdown = lazy(() =>
  import("./QuestionBreakdown").then((mod) => ({
    default: mod.QuestionBreakdown,
  })),
);

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
    error,
    refetch,
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
          <Button onPress={() => router.push("/mock-interview")}>
            Back to Mock Interview
          </Button>
        </div>
      </div>
    );
  }

  if (isError) {
    const errorMessage = error?.message || "Unknown error";
    const isTimeout =
      errorMessage.includes("timeout") ||
      errorMessage.includes("Request timeout");
    const isAuthError =
      errorMessage.includes("User ID is required") ||
      errorMessage.includes("authentication");

    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-6">
            {isTimeout ? (
              <>
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-yellow-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Request Timed Out
                </h3>
                <p className="text-gray-600 mb-4">
                  The grading process is taking longer than expected. This
                  usually happens when our AI is processing complex responses.
                </p>
              </>
            ) : isAuthError ? (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Session Expired
                </h3>
                <p className="text-gray-600 mb-4">
                  Your session has expired. Please log in again to view your
                  results.
                </p>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Failed to Load Results
                </h3>
                <p className="text-gray-600 mb-4">{errorMessage}</p>
              </>
            )}
          </div>

          <div className="space-y-3">
            {(isTimeout || !isAuthError) && (
              <Button
                className="w-full"
                color="primary"
                onPress={() => refetch()}
              >
                Try Again
              </Button>
            )}
            <Button
              className="w-full"
              variant="bordered"
              onPress={() => router.push("/mock-interview")}
            >
              Back to Mock Interview
            </Button>
            {isAuthError && (
              <Button
                className="w-full"
                color="primary"
                onPress={() => router.push("/auth/login")}
              >
                Log In Again
              </Button>
            )}
          </div>
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
    <div className="bg-white w-full min-h-screen">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <div className="mb-3">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Hero Section - Celebration */}
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path
                clipRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                fillRule="evenodd"
              />
            </svg>
            Interview Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
            You&apos;re One Step Closer
            <br />
            <span className="text-adult-green">to the Real Thing!</span>
          </h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
            You&apos;ve completed {sessionMetadata.answeredQuestions} out of{" "}
            {sessionMetadata.totalQuestions} questions — great job! Practicing
            your answers is a key step toward showing up confident.
          </p>
        </div>

        {/* Score Section */}
        <div className="mb-16">
          <div className="p-8 md:p-12 border-b border-gray-200">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Your Overall Score
              </h2>

              {/* Professional Gauge Component */}
              <div className="w-96 h-64 mx-auto mb-8">
                <Suspense
                  fallback={
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="text-6xl font-bold text-gray-900 animate-pulse">
                        {scorePercentage}%
                      </div>
                    </div>
                  }
                >
                  <GaugeComponent
                    arc={{
                      colorArray: ["#EF4444", "#F59E0B", "#10B981"],
                      padding: 0.02,
                      subArcs: [{ limit: 40 }, { limit: 70 }, { limit: 100 }],
                    }}
                    labels={{
                      valueLabel: {
                        formatTextValue: (value: number) => `${value}%`,
                        style: {
                          fontSize: "64px",
                          fontWeight: "bold",
                          fill: "#1F2937",
                        },
                      },
                    }}
                    pointer={{
                      type: "blob",
                      animationDelay: 0,
                    }}
                    type="semicircle"
                    value={scorePercentage}
                  />
                </Suspense>
                {/* Score Label Below */}
                <div className="text-center mt-6">
                  <p className="text-2xl font-semibold text-adult-green">
                    {scoreLabel}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-4">
                <button
                  className="px-6 py-3 border-2 border-adult-green text-adult-green rounded-full font-medium transition-all duration-200 hover:bg-adult-green hover:text-white hover:shadow-md hover:scale-105 active:scale-95 active:shadow-sm"
                  onClick={handleRetake}
                >
                  Practice Again
                </button>
                <button
                  className="px-6 py-3 bg-transparent text-gray-600 rounded-full font-medium transition-all duration-200 hover:text-gray-800 hover:scale-105 active:scale-95"
                  onClick={() => router.push("/dashboard")}
                >
                  Proceed to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Breakdown */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            Performance Breakdown
          </h2>
          <Suspense
            fallback={
              <div className="bg-white rounded-lg p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="bg-gray-50 rounded-lg p-4 h-32 animate-pulse"
                    />
                  ))}
                </div>
              </div>
            }
          >
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
          </Suspense>
        </div>

        {/* Strengths & Feedback */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* What's Working Well */}
          <div className="bg-green-50 rounded-2xl p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    fillRule="evenodd"
                  />
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
                <svg
                  className="w-4 h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    clipRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    fillRule="evenodd"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900">
                Areas for Growth
              </h3>
            </div>
            <div className="text-gray-800 leading-relaxed">
              <div className="prose prose-sm max-w-none">
                <Suspense
                  fallback={
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded animate-pulse" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
                      <div className="h-4 bg-gray-200 rounded animate-pulse w-4/6" />
                    </div>
                  }
                >
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
                </Suspense>
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
