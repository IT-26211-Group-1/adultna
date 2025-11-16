"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Button, Card, CardBody } from "@heroui/react";
import { ArrowLeft } from "lucide-react";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { useGetAnswersByIds } from "@/hooks/queries/useInterviewAnswers";
import type { InterviewAnswer } from "@/types/interview-answer";
import ReactMarkdown from "react-markdown";
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              onClick={() => router.push("/mock-interview")}
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{sessionMetadata.jobRole}</span>
            </button>
          </div>
          <div className="text-2xl font-bold text-adult-green">AdultNa.</div>
          <div className="w-10 h-10 rounded-full bg-adult-green flex items-center justify-center">
            <span className="text-white text-sm font-semibold">U</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Card - Motivational Message */}
          <Card className="bg-white">
            <CardBody className="p-12 flex flex-col items-center justify-center text-center">
              <h1 className="text-4xl font-bold text-gray-900 mb-6">
                You&apos;re One Step Closer
                <br />
                to the Real Thing!
              </h1>
              <p className="text-gray-600 mb-8 max-w-md">
                You&apos;ve completed {sessionMetadata.answeredQuestions} out of{" "}
                {sessionMetadata.totalQuestions} questions — great job!
                Practicing your answers is a key step toward showing up
                confident. Here&apos;s a summary of how you did and what you can
                improve.
              </p>
              <div className="flex gap-4 w-full max-w-md">
                <Button
                  className="flex-1 border-2 border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium"
                  size="lg"
                  variant="bordered"
                  onPress={() => router.push("/dashboard")}
                >
                  Go to Dashboard
                </Button>
                <Button
                  className="flex-1 bg-adult-green text-white hover:bg-adult-green/90 font-medium"
                  size="lg"
                  onPress={handleRetake}
                >
                  Retake
                </Button>
              </div>
            </CardBody>
          </Card>

          {/* Right Column - Score and Feedback */}
          <div className="space-y-6">
            {/* Score Card */}
            <Card className="bg-white">
              <CardBody className="p-8">
                <h2 className="text-xl font-semibold text-gray-900 text-center mb-6">
                  Your Score
                </h2>
                <div className="flex flex-col items-center">
                  {/* Semi-circular Gauge */}
                  <div className="relative w-64 h-32 mb-4">
                    <svg className="w-full h-full" viewBox="0 0 200 100">
                      {/* Background Arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#E5E7EB"
                        strokeLinecap="round"
                        strokeWidth="20"
                      />
                      {/* Colored Arc */}
                      <path
                        d="M 20 100 A 80 80 0 0 1 180 100"
                        fill="none"
                        stroke="#10B981"
                        strokeDasharray={`${(scorePercentage / 100) * 251.2} 251.2`}
                        strokeLinecap="round"
                        strokeWidth="20"
                        style={{
                          transition: "stroke-dasharray 1s ease-in-out",
                        }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <div className="text-5xl font-bold text-gray-900">
                        {scorePercentage}%
                      </div>
                    </div>
                  </div>
                  <p className="text-lg font-semibold text-[#10B981]">
                    {scoreLabel}
                  </p>
                </div>
              </CardBody>
            </Card>

            {/* Verdict Section */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Detailed Feedback
              </h3>
              <div className="max-h-96 overflow-y-auto pr-2">
                <div className="text-gray-700 leading-relaxed prose prose-sm max-w-none">
                  <ReactMarkdown
                    components={{
                      strong: ({ children }) => (
                        <strong className="font-semibold text-gray-900">
                          {children}
                        </strong>
                      ),
                      p: ({ children }) => (
                        <p className="mb-3 last:mb-0">{children}</p>
                      ),
                      h2: ({ children }) => (
                        <h2 className="text-base font-bold text-gray-900 mt-4 mb-2">
                          {children}
                        </h2>
                      ),
                    }}
                  >
                    {verdict}
                  </ReactMarkdown>
                </div>
              </div>
            </div>

            {/* What's Working Well Section */}
            <div className="bg-white rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                What&apos;s Working Well
              </h3>
              <ul className="space-y-2">
                {uniqueStrengths.length > 0 ? (
                  uniqueStrengths.map((strength, index) => (
                    <li
                      key={index}
                      className="flex items-start gap-2 text-gray-700"
                    >
                      <span className="text-gray-400 mt-1">•</span>
                      <span>{strength}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-gray-500 italic">
                    Complete more questions to see detailed feedback
                  </li>
                )}
              </ul>
            </div>

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
        </div>

        <div className="mt-6">
          <QuestionBreakdown answers={gradedAnswers} />
        </div>
      </div>
    </div>
  );
}
