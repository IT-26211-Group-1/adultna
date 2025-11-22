"use client";

import { ProcessStep } from "@/types/govguide";

type CompleteGuideTabProps = {
  steps: ProcessStep[];
};

export default function CompleteGuideTab({ steps }: CompleteGuideTabProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">No step-by-step guide available yet.</p>
      </div>
    );
  }

  const sortedSteps = [...steps].sort((a, b) => a.stepNumber - b.stepNumber);

  return (
    <div className="space-y-4">
      {sortedSteps.map((step) => (
        <div
          key={step.stepNumber}
          className="flex gap-3 pb-4 border-b border-gray-200 last:border-0 last:pb-0"
        >
          <div className="flex-shrink-0">
            <div className="w-7 h-7 rounded-full bg-adult-green text-white flex items-center justify-center text-xs font-semibold">
              {step.stepNumber}
            </div>
          </div>
          <div className="flex-1 mt-1.5">
            <h3 className="text-sm text-gray-900 mb-2 leading-tight">
              {step.title}
            </h3>
            {step.description && (
              <p className="text-xs text-gray-700 mb-2 whitespace-pre-line leading-relaxed">
                {step.description}
              </p>
            )}
            {step.estimatedTime && (
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-2">
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
