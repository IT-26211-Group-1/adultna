"use client";

import React from "react";
import { steps } from "./steps";

interface ProgressStepperProps {
  currentStep: string;
  setCurrentStep: (step: string) => void;
}

export default function ProgressStepper({
  currentStep,
  setCurrentStep,
}: ProgressStepperProps) {
  const currentStepIndex = steps.findIndex((step) => step.key === currentStep);
  const currentStepData = steps[currentStepIndex];
  const progressPercentage = ((currentStepIndex + 1) / steps.length) * 100;

  const canGoBack = currentStepIndex > 0;
  const canGoForward = currentStepIndex < steps.length - 1;

  const goToPreviousStep = () => {
    if (canGoBack) {
      setCurrentStep(steps[currentStepIndex - 1].key);
    }
  };

  const goToNextStep = () => {
    if (canGoForward) {
      setCurrentStep(steps[currentStepIndex + 1].key);
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
              onClick={goToPreviousStep}
              disabled={!canGoBack}
              className={`p-1 rounded transition-colors ${
                canGoBack
                  ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Previous step"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-lg font-semibold text-emerald-700 px-2">
              {currentStepData?.title}
            </div>
            <button
              onClick={goToNextStep}
              disabled={!canGoForward}
              className={`p-1 rounded transition-colors ${
                canGoForward
                  ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                  : "text-gray-300 cursor-not-allowed"
              }`}
              aria-label="Next step"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                onClick={goToPreviousStep}
                disabled={!canGoBack}
                className={`p-2 rounded transition-colors ${
                  canGoBack
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Previous step"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-base font-semibold text-emerald-700 px-3">
                {currentStepData?.title}
              </div>
              <button
                onClick={goToNextStep}
                disabled={!canGoForward}
                className={`p-2 rounded transition-colors ${
                  canGoForward
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Next step"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                onClick={goToPreviousStep}
                disabled={!canGoBack}
                className={`p-2 rounded transition-colors ${
                  canGoBack
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Previous step"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div className="text-lg font-semibold text-emerald-700 px-4">
                {currentStepData?.title}
              </div>
              <button
                onClick={goToNextStep}
                disabled={!canGoForward}
                className={`p-2 rounded transition-colors ${
                  canGoForward
                    ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                    : "text-gray-300 cursor-not-allowed"
                }`}
                aria-label="Next step"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
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
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 mb-2 ${
                  index <= currentStepIndex
                    ? "bg-emerald-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                }`}
                onClick={() => setCurrentStep(step.key)}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
              >
                {index + 1}
              </button>

              {/* Step Label */}
              <button
                className={`text-xs text-center leading-tight transition-colors max-w-20 ${
                  step.key === currentStep
                    ? "text-emerald-700 font-medium"
                    : "text-gray-500 hover:text-gray-700"
                }`}
                onClick={() => setCurrentStep(step.key)}
                aria-label={`Go to step ${index + 1}: ${step.title}`}
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