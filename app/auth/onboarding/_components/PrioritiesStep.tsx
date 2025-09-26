"use client";

import React, { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
import { PrioritiesStepProps } from "@/types/onboarding";
import { usePriorities } from "../hooks/usePriorities";

function PrioritiesStep({
  selectedPriorities,
  setSelectedPriorities,
  onNext,
  onSkip,
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
      <p className="text-gray-600 mb-8">
        Select all that apply (you can change these later)
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {options.map((option) => (
            <label
              key={option.id}
              className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPriorities.some(
                  (p) =>
                    p.questionId === prioritiesQuestion.id &&
                    p.optionId === option.id,
                )
                  ? "border-teal-500 bg-teal-50"
                  : "border-gray-300 hover:bg-gray-50"
              }`}
            >
              <input
                checked={selectedPriorities.some(
                  (p) =>
                    p.questionId === prioritiesQuestion.id &&
                    p.optionId === option.id,
                )}
                className="mr-3 text-teal-600"
                type="checkbox"
                onChange={() =>
                  handleTogglePriority(prioritiesQuestion.id, option.id)
                }
              />
              <span className="text-gray-900 text-sm">{option.optionText}</span>
            </label>
          ))}
        </div>

        <div className="flex justify-between">
          <button
            className="text-gray-500 hover:text-gray-700 px-6 py-2 font-medium transition-colors"
            onClick={onSkip}
          >
            Skip
          </button>
          <button
            className="bg-teal-700 hover:bg-teal-800 text-white px-6 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2"
            onClick={onNext}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default memo(PrioritiesStep);
