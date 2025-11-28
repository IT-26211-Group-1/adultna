import React from "react";

type ProgressIndicatorProps = {
  currentStep: number;
  onStepClick?: (step: number) => void;
};

const steps = [
  { number: 1, label: "Introduction" },
  { number: 2, label: "Life Stage" },
  { number: 3, label: "Priorities" },
  { number: 4, label: "Your Path" },
];

const ProgressIndicator = React.memo(
  ({ currentStep, onStepClick }: ProgressIndicatorProps) => {
    return (
      <div className="flex items-start justify-center mb-6 sm:mb-8 mx-4 sm:mx-8 mt-2 sm:mt-4">
        {steps.map((step, index) => (
          <React.Fragment key={step.number}>
            <div className="flex flex-col items-center">
              <button
                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-medium text-sm sm:text-base transition-all ${
                  step.number === currentStep
                    ? "bg-teal-700 text-white"
                    : step.number < currentStep
                      ? "bg-teal-100 text-teal-700 border-2 border-teal-700 hover:bg-teal-200 cursor-pointer"
                      : "bg-gray-200 text-gray-500 cursor-not-allowed"
                } ${onStepClick && step.number <= currentStep ? "hover:scale-110" : ""}`}
                disabled={!onStepClick || step.number > currentStep}
                type="button"
                onClick={() => onStepClick?.(step.number)}
              >
                {step.number}
              </button>
              <span className="text-xs mt-1 sm:mt-2 text-gray-600 text-center min-h-[2rem] sm:min-h-[2.5rem] w-12 sm:w-16 leading-tight">
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="w-8 sm:w-16 h-0.5 bg-gray-300 mx-2 sm:mx-4 mt-3 sm:mt-5" />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  },
);

ProgressIndicator.displayName = "Progress Indicator";
export default ProgressIndicator;
