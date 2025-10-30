"use client";

import React, { memo, useMemo } from "react";
import { useInterviewQuestions } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { Skeleton } from "@/components/ui/Skeletons";

type JobRoleSelectorProps = {
  selectedIndustry: string;
  onSelectJobRole: (jobRole: string) => void;
  onBack: () => void;
};

const SKELETON_COUNT = 4;
const skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

export const JobRoleSelector = memo(function JobRoleSelector({
  selectedIndustry,
  onSelectJobRole,
  onBack,
}: JobRoleSelectorProps) {
  const { questions, isLoadingQuestions, questionsError, refetchQuestions } =
    useInterviewQuestions({
      status: "approved",
    });

  const jobRoles = useMemo(() => {
    const rolesSet = new Set<string>();

    questions
      .filter((q) => q.industry === selectedIndustry)
      .forEach((q) => {
        if (q.jobRoles && q.jobRoles.length > 0) {
          q.jobRoles.forEach((role) => rolesSet.add(role));
        }
      });

    return Array.from(rolesSet).sort();
  }, [questions, selectedIndustry]);

  if (isLoadingQuestions) {
    return (
      <div className="space-y-4">
        <button
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
          onClick={onBack}
        >
          ← Back to Fields
        </button>
        <h2 className="text-2xl font-semibold">Choose a Job Role</h2>
        <div className="space-y-2">
          {skeletonItems.map((i) => (
            <Skeleton
              key={i}
              className="h-16 animate-[pulse_1s_ease-in-out_infinite]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (questionsError) {
    return (
      <div className="space-y-4">
        <button
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
          onClick={onBack}
        >
          ← Back to Fields
        </button>
        <h2 className="text-2xl font-semibold">Choose a Job Role</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Failed to load job roles. Please try again.
          </p>
          <button
            className="px-4 py-2 bg-adult-green text-white rounded-lg hover:bg-adult-green/90 transition-colors"
            onClick={() => refetchQuestions()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (jobRoles.length === 0) {
    return (
      <div className="space-y-4">
        <button
          className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2"
          onClick={onBack}
        >
          ← Back to Fields
        </button>
        <h2 className="text-2xl font-semibold">Choose a Job Role</h2>
        <div className="text-center py-8 text-gray-500">
          No job roles available for this field yet. Please contact an
          administrator to add interview questions.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        className="text-adult-green hover:text-adult-green/80 font-medium flex items-center gap-2 mb-2"
        onClick={onBack}
      >
        ← Back
      </button>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-gray-900">
          Select Your Target Job Role
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {jobRoles.map((role) => (
          <button
            key={role}
            className="px-6 py-8 text-left bg-white border border-gray-200 rounded-lg hover:border-adult-green hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-adult-green focus:ring-offset-2"
            onClick={() => onSelectJobRole(role)}
          >
            <span className="text-base font-medium text-gray-900 block">
              {role}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
