import React from "react";

type ProgressIndicatorProps = {
  currentStep: number;
};

const steps = [
  { number: 1, label: "Introduction" },
  { number: 2, label: "Life Stage" },
  { number: 3, label: "Priorities" },
  { number: 4, label: "Your Path" },
];

const ProgressIndicator = React.memo(
  ({ currentStep }: ProgressIndicatorProps) => {
    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                  step.number === currentStep
                    ? "bg-teal-700 text-white"
                    : step.number < currentStep
                      ? "bg-teal-100 text-teal-700 border-2 border-teal-700"
                      : "bg-gray-200 text-gray-500"
                }`}
              >
                {step.number}
              </div>
              <span className="text-xs mt-2 text-gray-600">{step.label}</span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-0.5 bg-gray-300 mx-4 mt-[-20px]" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }
);

export default ProgressIndicator;
