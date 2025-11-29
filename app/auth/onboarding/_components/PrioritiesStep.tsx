"use client";

import React, { memo, useCallback } from "react";
import { PrioritiesStepProps } from "@/types/onboarding";
import { usePriorities } from "../hooks/usePriorities";

function PrioritiesStep({
  selectedPriorities,
  setSelectedPriorities,
}: PrioritiesStepProps) {
  const { prioritiesQuestion, loading, error, togglePriority } =
    usePriorities();

  const handleTogglePriority = useCallback(
    (questionId: number, optionId: number) => {
      togglePriority(
        questionId,
        optionId,
        selectedPriorities,
        setSelectedPriorities,
      );
    },
    [togglePriority, selectedPriorities, setSelectedPriorities],
  );

  if (loading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600 mx-auto mb-4" />
        <p className="text-gray-600">Loading questions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <button
          className="bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          onClick={() => window.location.reload()}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!prioritiesQuestion) {
    return (
      <p className="text-center text-gray-600">No priorities question found.</p>
    );
  }

  const options = prioritiesQuestion?.options || [];

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {prioritiesQuestion.question}
      </h2>
      <p className="text-sm italic text-gray-600 mb-8">
        Select all that apply (you can change these later)
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              className={`group inline-flex items-center justify-center min-h-[44px] py-3 px-6 border rounded-full font-semibold transition-all duration-200 focus:outline-none ${
                selectedPriorities.some(
                  (p) =>
                    p.questionId === prioritiesQuestion.id &&
                    p.optionId === option.id,
                )
                  ? "border-teal-600 bg-teal-50 text-teal-700 hover:bg-teal-100"
                  : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              onClick={() =>
                handleTogglePriority(prioritiesQuestion.id, option.id)
              }
            >
              <span className="text-sm font-semibold transition-colors duration-200 inline-flex items-center justify-center">
                {option.optionText}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default memo(PrioritiesStep);
