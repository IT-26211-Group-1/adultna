import React from "react";
import { ChevronRight } from "lucide-react";

type LifeStageStepProps = {
  selectedLifeStage: string;
  setSelectedLifeStage: (stage: string) => void;
  onNext: () => void;
  onSkip: () => void;
};

const lifeStages = [
  "Student",
  "Early Career",
  "Mid Career",
  "Senior Professional",
  "Entrepreneur",
  "Retired",
  "Other",
];

export default function LifeStageStep({
  selectedLifeStage,
  setSelectedLifeStage,
  onNext,
  onSkip,
}: LifeStageStepProps) {
  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        What&#39;s your current life stage?
      </h2>
      <p className="text-gray-600 mb-8">
        This helps us personalize your experience
      </p>

      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-3">
          {lifeStages.map((stage) => (
            <label
              key={stage}
              className="flex items-center p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <input
                checked={selectedLifeStage === stage}
                className="mr-3 text-teal-600"
                name="lifeStage"
                type="radio"
                value={stage}
                onChange={(e) => setSelectedLifeStage(e.target.value)}
              />
              <span className="text-gray-900">{stage}</span>
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
