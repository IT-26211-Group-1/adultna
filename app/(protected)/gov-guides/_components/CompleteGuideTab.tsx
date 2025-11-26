"use client";

import { ProcessStep } from "@/types/govguide";

// Function to parse and format numbered lists from admin input
function parseNumberedList(text: string): string[] | null {
  // Check if text contains numbered items (1. 2. 3. etc.)
  const numberedItemRegex = /(\d+\.\s+[^0-9]+?)(?=\d+\.\s+|$)/g;
  const matches = text.match(numberedItemRegex);

  if (matches && matches.length > 2) {
    // Only format if 3+ items
    return matches.map((item) => item.trim());
  }

  return null;
}

type CompleteGuideTabProps = {
  steps: ProcessStep[];
};

export default function CompleteGuideTab({ steps }: CompleteGuideTabProps) {
  if (!steps || steps.length === 0) {
    return (
      <div className="text-center">
        <p className="text-sm text-gray-600">
          No step-by-step guide available yet.
        </p>
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
              <div className="text-xs text-gray-700 mb-2">
                {(() => {
                  const numberedItems = parseNumberedList(step.description);

                  if (numberedItems) {
                    return (
                      <ol className="list-none space-y-2 leading-relaxed">
                        {numberedItems.map((item, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="font-semibold text-adult-green min-w-[1.5rem] text-xs">
                              {index + 1}.
                            </span>
                            <span className="flex-1">
                              {item.replace(/^\d+\.\s*/, "")}
                            </span>
                          </li>
                        ))}
                      </ol>
                    );
                  }

                  return (
                    <p className="whitespace-pre-line leading-relaxed">
                      {step.description}
                    </p>
                  );
                })()}
              </div>
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
