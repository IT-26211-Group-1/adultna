"use client";

import { ProcessStep } from "@/types/govguide";

type CompleteGuideTabProps = {
  steps: ProcessStep[];
};

export default function CompleteGuideTab({ steps }: CompleteGuideTabProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
        <p className="text-gray-600">No step-by-step guide available yet.</p>
      </div>
    );
  }

  const sortedSteps = [...steps].sort(
    (a, b) => a.stepNumber - b.stepNumber
  );

  return (
    <div className="space-y-6">
      {sortedSteps.map((step, index) => (
        <div
          key={index}
          className="flex gap-4 pb-6 border-b border-gray-200 last:border-0 last:pb-0"
        >
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-full bg-adult-green text-white flex items-center justify-center font-semibold">
              {step.stepNumber}
            </div>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {step.title}
            </h3>
            {step.description && (
              <p className="text-gray-700 mb-2 whitespace-pre-line">
                {step.description}
              </p>
            )}
            {step.estimatedTime && (
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                <span className="font-medium">Estimated time:</span>
                <span>{step.estimatedTime}</span>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
