"use client";

import React, { memo } from "react";
import { ChevronRight } from "lucide-react";
import { useLifeStage } from "../hooks/useLifeStage";

type LifeStageStepProps = {
  selectedLifeStage: { questionId: number; optionId: number } | null;
  setSelectedLifeStage: (
    stage: { questionId: number; optionId: number } | null,
  ) => void;
  onNext: () => void;
  onSkip: () => void;
};

function LifeStageStep({
  selectedLifeStage,
  setSelectedLifeStage,
  onNext,
  onSkip,
}: LifeStageStepProps) {
  const { lifeStageQuestion, loading, error, isSelected, createSelectHandler } =
    useLifeStage();

  {
    /* TODO: Change the Loading animation into a skeletion animation */
  }

  const options = lifeStageQuestion?.options || [];

  if (loading) {
    return <p className="text-center text-gray-600">Loading questions...</p>;
  }

  if (error) {
    return (
      <div className="text-center">
        <p className="text-red-600 mb-4">
          {error instanceof Error ? error.message : "An error occurred"}
        </p>
        <button
          className="text-teal-600 hover:text-teal-700"
          onClick={() => window.location.reload()}
        >
          Try again
        </button>
      </div>
    );
  }

  if (!lifeStageQuestion) {
    return (
      <p className="text-center text-gray-600">No life stage question found.</p>
    );
  }

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        {lifeStageQuestion.question}
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us personalize your experience
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {options.map((option) => (
            <label
              key={option.id}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                checked={isSelected(
                  option.id,
                  lifeStageQuestion.id,
                  selectedLifeStage,
                )}
                className="mr-3 text-teal-600"
                name="lifeStage"
                type="radio"
                value={option.id}
                onChange={() =>
                  setSelectedLifeStage(
                    createSelectHandler(lifeStageQuestion.id, option.id),
                  )
                }
              />
              <span className="text-gray-900">{option.optionText}</span>
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

export default memo(LifeStageStep);
