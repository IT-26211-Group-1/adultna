import React, { memo } from "react";

// Steps constant (never changes, defined outside component)
const STEPS = [
  {
    number: 1,
    title: "Choose a Field",
    description: "Select an industry you're preparing for.",
  },
  {
    number: 2,
    title: "Select your Role",
    description:
      "Choose a job position so we can tailor the questions for you.",
  },
  {
    number: 3,
    title: "Review Interview Guidelines",
    description: "Before you begin, we'll show tips and a practice question.",
  },
  {
    number: 4,
    title: "Start Your Mock Interview",
    description: "Enable your mic or use your keyboard to answer questions.",
  },
  {
    number: 5,
    title: "Track Your Progress",
    description: "Check your performance and identify areas to improve.",
  },
] as const;

export const HowItWorks = memo(function HowItWorks() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">How it Works</h2>
      <div className="space-y-5">
        {STEPS.map((step) => (
          <div key={step.number} className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-7 h-7 bg-gradient-to-r from-adult-green to-adult-green/80 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
              {step.number}
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});
