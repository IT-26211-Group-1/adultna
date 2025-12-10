"use client";

import React from "react";
import { steps } from "./steps";
import { ResumeData } from "@/validators/resumeSchema";

interface ProgressStepperProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
  completedSteps?: string[];
  resumeData?: ResumeData;
}

export default function ProgressStepper({
  currentStep,
  setCurrentStep,
  completedSteps = [],
  resumeData,
}: ProgressStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const currentStepData = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  // Check if contact information step is completed based on required fields
  const isContactCompleted = resumeData
    ? !!(
        resumeData.firstName?.trim() &&
        resumeData.lastName?.trim() &&
        resumeData.email?.trim() &&
        resumeData.phone?.trim()
      )
    : completedSteps.includes("contact");

  // Function to check if a step is accessible
  const isStepAccessible = (stepKey: string) => {
    // Contact step is always accessible
    if (stepKey === "contact") return true;

    // Other steps are only accessible if contact is completed
    return isContactCompleted;
  };

  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < steps.length - 1;

  const goToPreviousStep = () => {
    if (canGoBack) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const goToNextStep = () => {
    if (canGoForward) {
      const nextStep = steps[currentStepIndex + 1];

      if (isStepAccessible(nextStep.key)) {
        setCurrentStep(nextStep.key);
      }
    }
  };

  return (
    <div className="mb-8">
      {/* Mobile Design (< 640px) */}
      <div className="sm:hidden">
        {/* Step Counter and Title */}
        <div className="text-center mb-4">
          <div className="text-sm font-medium text-gray-600 mb-1">
            Step {currentStepIndex + 1} of {steps.length}
          </div>
          <div className="flex items-center justify-center gap-3">
            <button
              aria-label="Previous step"
              className={`p-1 rounded transition-colors ${
                canGoBack
                  ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!canGoBack}
              onClick={goToPreviousStep}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M15 19l-7-7 7-7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
            <div className="text-lg font-semibold text-emerald-700 px-2">
              {currentStepData?.title}
            </div>
            <button
              aria-label="Next step"
              className={`p-1 rounded transition-colors ${
                canGoForward
                  ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              disabled={!canGoForward}
              onClick={goToNextStep}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M9 5l7 7-7 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Tablet Design (641px - 1024px) */}
      <div className="hidden sm:flex lg:hidden flex-col items-center">
        {/* Progress Bar for Tablet */}
        <div className="w-full max-w-md">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                aria-label="Previous step"
                className={`p-2 rounded transition-colors ${
                  canGoBack
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!canGoBack}
                onClick={goToPreviousStep}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
              <div className="text-base font-semibold text-emerald-700 px-3">
                {currentStepData?.title}
              </div>
              <button
                aria-label="Next step"
                className={`p-2 rounded transition-colors ${
                  canGoForward
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!canGoForward}
                onClick={goToNextStep}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Medium Desktop Design (1024px - 1319px) */}
      <div className="hidden lg:flex xl:hidden flex-col items-center">
        {/* Progress Bar for Medium Desktop */}
        <div className="w-full max-w-lg">
          <div className="text-center mb-3">
            <div className="text-sm font-medium text-gray-600 mb-1">
              Step {currentStepIndex + 1} of {steps.length}
            </div>
            <div className="flex items-center justify-center gap-4">
              <button
                aria-label="Previous step"
                className={`p-2 rounded transition-colors ${
                  canGoBack
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!canGoBack}
                onClick={goToPreviousStep}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
              <div className="text-lg font-semibold text-emerald-700 px-4">
                {currentStepData?.title}
              </div>
              <button
                aria-label="Next step"
                className={`p-2 rounded transition-colors ${
                  canGoForward
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!canGoForward}
                onClick={goToNextStep}
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                  />
                </svg>
              </button>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Large Desktop Design (≥ 1320px) */}
      <div className="hidden xl:flex items-start justify-center gap-2">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step Container */}
            <div className="flex flex-col items-center flex-shrink-0">
              {/* Step Circle */}
              <button
                aria-label={`Go to step ${index + 1}: ${step.title}`}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 mb-2 ${
                  index <= currentStepIndex
                    ? "bg-emerald-600 text-white shadow-md"
                    : isStepAccessible(step.key)
                      ? "bg-gray-200 text-gray-400 hover:bg-gray-300"
                      : "bg-gray-100 text-gray-300 cursor-not-allowed"
                }`}
                disabled={!isStepAccessible(step.key)}
                onClick={() => {
                  if (isStepAccessible(step.key)) {
                    setCurrentStep(step.key);
                  }
                }}
              >
                {index + 1}
              </button>

              {/* Step Label */}
              <button
                aria-label={`Go to step ${index + 1}: ${step.title}`}
                className={`text-xs text-center leading-tight transition-colors max-w-20 ${
                  step.key === currentStep
                    ? "text-emerald-700 font-medium"
                    : isStepAccessible(step.key)
                      ? "text-gray-500 hover:text-gray-700"
                      : "text-gray-300 cursor-not-allowed"
                }`}
                disabled={!isStepAccessible(step.key)}
                onClick={() => {
                  if (isStepAccessible(step.key)) {
                    setCurrentStep(step.key);
                  }
                }}
              >
                {step.title}
              </button>
            </div>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 flex-shrink-0 mt-4 transition-all duration-200 ${
                  index < currentStepIndex ? "bg-emerald-600" : "bg-gray-200"
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}
