"use client";

import React, { memo, useMemo } from "react";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { Skeleton } from "@/components/ui/Skeletons";
import type { InterviewQuestion } from "@/types/interview-question";

type QuestionsListProps = {
  selectedIndustry: string;
  selectedJobRole: string;
  onBack: () => void;
};

const SKELETON_COUNT = 6;
const skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

// Category labels (constant, no need to recreate)
const CATEGORY_LABELS: Record<string, string> = {
  behavioral: "Behavioral Questions",
  technical: "Technical Questions",
  situational: "Situational Questions",
  background: "Background Questions",
};

// Format industry name (outside component for performance)
const formatIndustryName = (industry: string) =>
  industry.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const QuestionsList = memo(function QuestionsList({
  selectedIndustry,
  selectedJobRole,
  onBack,
}: QuestionsListProps) {
  const { questions, isLoadingQuestions, questionsError, refetchQuestions } = useInterviewQuestions({
    status: "approved",
  });

  // Filter questions for the selected industry and job role using the new jobRoles array
  const filteredQuestions = useMemo(() => {
    return questions.filter(
      (q) =>
        q.industry === selectedIndustry &&
        q.jobRoles &&
        q.jobRoles.includes(selectedJobRole)
    );
  }, [questions, selectedIndustry, selectedJobRole]);

  // Group questions by category
  const questionsByCategory = useMemo(() => {
    const grouped: Record<string, InterviewQuestion[]> = {};
    filteredQuestions.forEach((q) => {
      if (!grouped[q.category]) {
        grouped[q.category] = [];
      }
      grouped[q.category].push(q);
    });
    return grouped;
  }, [filteredQuestions]);

  const formattedIndustry = useMemo(() => formatIndustryName(selectedIndustry), [selectedIndustry]);

  if (isLoadingQuestions) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
        >
          ← Back to Job Roles
        </button>
        <h2 className="text-2xl font-semibold">Practice Questions</h2>
        <div className="space-y-2">
          {skeletonItems.map((i) => (
            <Skeleton key={i} className="h-20 animate-[pulse_1s_ease-in-out_infinite]" />
          ))}
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
        >
          ← Back to Job Roles
        </button>
        <h2 className="text-2xl font-semibold">Practice Questions</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">Failed to load questions. Please try again.</p>
          <button
            onClick={() => refetchQuestions()}
            className="px-4 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (filteredQuestions.length === 0) {
    return (
      <div className="space-y-4">
        <button
          onClick={onBack}
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
        >
          ← Back to Job Roles
        </button>
        <h2 className="text-2xl font-semibold">Practice Questions</h2>
        <div className="text-center py-8 text-gray-500">
          No approved questions available for this job role yet. Please contact an administrator to add interview questions.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <button
          onClick={onBack}
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2 mb-4"
        >
          ← Back to Job Roles
        </button>
        <h2 className="text-2xl font-semibold">Practice Questions</h2>
        <div className="mt-2 space-y-1 text-sm text-gray-600">
          <p>
            Field: <span className="font-medium">{formattedIndustry}</span>
          </p>
          <p>
            Job Role: <span className="font-medium">{selectedJobRole}</span>
          </p>
          <p>
            Total Questions: <span className="font-medium">{filteredQuestions.length}</span>
          </p>
        </div>
      </div>

      {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <span className="w-2 h-2 bg-adult-green rounded-full"></span>
            {CATEGORY_LABELS[category] || category}
            <span className="text-sm font-normal text-gray-500">
              ({categoryQuestions.length})
            </span>
          </h3>
          <div className="space-y-2">
            {categoryQuestions.map((question, index) => (
              <div
                key={question.id}
                className="p-4 bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
              >
                <div className="flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-adult-green/10 text-adult-green rounded-full flex items-center justify-center text-sm font-medium">
                    {index + 1}
                  </span>
                  <p className="text-base text-gray-900 flex-1">
                    {question.question}
                  </p>
                </div>
                {question.source === "ai" && (
                  <span className="inline-block mt-2 ml-9 text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    AI Generated
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
});
