"use client";

import React, { memo } from "react";
import { useLifeStage } from "../hooks/useLifeStage";

type LifeStageStepProps = {
  selectedLifeStage: { questionId: number; optionId: number } | null;
  setSelectedLifeStage: (
    stage: { questionId: number; optionId: number } | null,
  ) => void;
};

function LifeStageStep({
  selectedLifeStage,
  setSelectedLifeStage,
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
      <p className="text-sm italic text-gray-600 mb-8">
        This helps us personalize your experience
      </p>

      <div className="space-y-4">
        <div className="flex flex-wrap justify-center gap-3">
          {options.map((option) => (
            <button
              key={option.id}
              className={`group inline-flex items-center justify-center min-h-[44px] py-3 px-6 border rounded-full font-semibold transition-all duration-200 focus:outline-none ${
                isSelected(
                  option.id,
                  lifeStageQuestion.id,
                  selectedLifeStage,
                )
                  ? "border-teal-600 bg-teal-50 text-teal-700 hover:bg-teal-100"
                  : "border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 text-gray-700 hover:text-gray-900"
              }`}
              onClick={() =>
                setSelectedLifeStage(
                  createSelectHandler(lifeStageQuestion.id, option.id),
                )
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

export default memo(LifeStageStep);
