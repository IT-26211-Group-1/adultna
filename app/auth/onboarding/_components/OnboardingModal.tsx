"use client";

import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { STEPS } from "@/constants/onboarding";
import IntroductionStep from "./IntroductionStep";
import ProgressIndicator from "./ProgressIndicator";
import LifeStageStep from "./LifeStageStep";
import PrioritiesStep from "./PrioritiesStep";
import YourPathStep from "./YourPathStep";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function OnboardingModal({
  isOpen,
  onComplete,
  isSubmitting = false,
}: OnboardingModalProps) {
  const [hydrated, setHydrated] = useState(false);
  const { getSecureItem, setSecureItem } = useSecureStorage();

  useEffect(() => {
    setHydrated(true);
  }, []);

  // Use secure storage for onboarding data
  const [currentStep, setCurrentStep] = useState<number>(() => {
    const stored = getSecureItem("onboarding-currentStep");

    return stored ? parseInt(stored) : STEPS.INTRODUCTION;
  });

  const [displayName, setDisplayName] = useState<string>(() => {
    return getSecureItem("onboarding-displayName") || "";
  });

  const [selectedLifeStage, setSelectedLifeStage] = useState<{
    questionId: number;
    optionId: number;
  } | null>(() => {
    const stored = getSecureItem("onboarding-lifeStage");

    return stored ? JSON.parse(stored) : null;
  });

  const [selectedPriorities, setSelectedPriorities] = useState<
    { questionId: number; optionId: number }[]
  >(() => {
    const stored = getSecureItem("onboarding-priorities");

    return stored ? JSON.parse(stored) : [];
  });

  // Helper functions to update state and storage
  const updateCurrentStep = (step: number) => {
    setCurrentStep(step);
    setSecureItem("onboarding-currentStep", step.toString(), 1440); // 24 hours
  };

  const updateDisplayName = (name: string) => {
    setDisplayName(name);
    setSecureItem("onboarding-displayName", name, 1440); // 24 hours
  };

  const updateSelectedLifeStage = (
    lifeStage: { questionId: number; optionId: number } | null,
  ) => {
    setSelectedLifeStage(lifeStage);
    setSecureItem("onboarding-lifeStage", JSON.stringify(lifeStage), 1440); // 24 hours
  };

  const updateSelectedPriorities = (
    priorities:
      | { questionId: number; optionId: number }[]
      | ((
          prevState: { questionId: number; optionId: number }[],
        ) => { questionId: number; optionId: number }[]),
  ) => {
    setSelectedPriorities((prev) => {
      const newPriorities =
        typeof priorities === "function" ? priorities(prev) : priorities;

      setSecureItem(
        "onboarding-priorities",
        JSON.stringify(newPriorities),
        1440,
      ); // 24 hours

      return newPriorities;
    });
  };

  const nextStep = useCallback(() => {
    updateCurrentStep(
      currentStep < STEPS.YOUR_PATH ? currentStep + 1 : currentStep,
    );
  }, [currentStep, updateCurrentStep]);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const previousStep = useCallback(() => {
    updateCurrentStep(
      currentStep > STEPS.INTRODUCTION ? currentStep - 1 : currentStep,
    );
  }, [currentStep, updateCurrentStep]);

  const goToStep = useCallback(
    (step: number) => {
      if (step <= currentStep) {
        updateCurrentStep(step);
      }
    },
    [currentStep, updateCurrentStep],
  );

  const [isCompleting, setIsCompleting] = useState(false);

  const handleComplete = useCallback(
    async (data: any) => {
      setIsCompleting(true);
      await onComplete(data);

      // Reset onboarding state after successful submission
      updateCurrentStep(STEPS.INTRODUCTION);
      updateDisplayName("");
      updateSelectedLifeStage(null);
      updateSelectedPriorities([]);
    },
    [
      onComplete,
      updateCurrentStep,
      updateDisplayName,
      updateSelectedLifeStage,
      updateSelectedPriorities,
    ],
  );

  if (!isOpen || !hydrated) return null;

  if (isCompleting) {
    return (
      <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-6 z-50">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
          <div className="flex items-center justify-center min-h-[700px]">
            <div className="text-center">
              <LoadingSpinner fullScreen={false} size="xl" />
              <p className="mt-6 text-lg font-medium text-gray-700">
                Creating your personalized roadmap...
              </p>
              <p className="mt-2 text-sm text-gray-500">
                This will only take a moment
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.INTRODUCTION:
        return (
          <IntroductionStep
            displayName={displayName}
            setDisplayName={updateDisplayName}
            onNext={nextStep}
          />
        );
      case STEPS.LIFE_STAGE:
        return (
          <LifeStageStep
            selectedLifeStage={selectedLifeStage}
            setSelectedLifeStage={updateSelectedLifeStage}
            onBack={previousStep}
            onNext={nextStep}
            onSkip={skipStep}
          />
        );
      case STEPS.PRIORITIES:
        return (
          <PrioritiesStep
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={updateSelectedPriorities}
            onBack={previousStep}
            onNext={nextStep}
            onSkip={skipStep}
          />
        );
      case STEPS.YOUR_PATH:
        return (
          <YourPathStep
            displayName={displayName}
            isSubmitting={isSubmitting}
            lifeStage={selectedLifeStage}
            priorities={selectedPriorities}
            onBack={previousStep}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full min-h-[700px]">
          {/* Left Panel - Visual Storytelling */}
          <div className="lg:w-1/2 bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50 p-8 lg:p-12 flex flex-col justify-center relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-teal-200/30 rounded-full blur-xl" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-blue-200/30 rounded-full blur-xl" />

            <div className="relative z-10 max-w-md mx-auto lg:mx-0">
              {/* Logo */}
              <div className="mb-8">
                <Image
                  alt="AdultNa Logo"
                  className="h-10 w-auto"
                  height={40}
                  src="/AdultNa-Logo.png"
                  width={150}
                />
              </div>

              {/* Contextual Content */}
              <div className="mb-8">
                {currentStep === STEPS.INTRODUCTION && (
                  <>
                    <h3 className="text-2xl font-bold text-adult-green mb-4">
                      Welcome to Your Journey! 🚀
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      We're here to help you navigate adulthood with confidence. Let's start by getting to know you better.
                    </p>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                        Step 1 of 4 • Takes about 2 minutes
                      </div>
                    </div>
                  </>
                )}

                {currentStep === STEPS.LIFE_STAGE && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Your Life Stage Matters 🌱
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Understanding where you are in life helps us personalize your roadmap and suggest the most relevant resources for your journey.
                    </p>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                        Step 2 of 4 • Almost there!
                      </div>
                    </div>
                  </>
                )}

                {currentStep === STEPS.PRIORITIES && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      What Matters Most? 🎯
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Your priorities shape your path. Choose what you'd like to focus on, and we'll customize your experience accordingly.
                    </p>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-teal-500 rounded-full animate-pulse" />
                        Step 3 of 4 • You're doing great!
                      </div>
                    </div>
                  </>
                )}

                {currentStep === STEPS.YOUR_PATH && (
                  <>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">
                      Ready to Launch! 🎉
                    </h3>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      Perfect! We've got everything we need to create your personalized roadmap. Your journey to organized adulthood starts now.
                    </p>
                    <div className="bg-white/50 backdrop-blur-sm rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        Final Step • Let's get started!
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Visual Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>{Math.round((currentStep / STEPS.YOUR_PATH) * 100)}%</span>
                </div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div
                    className="bg-gradient-to-r from-teal-500 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentStep / STEPS.YOUR_PATH) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Interactive Content */}
          <div className="lg:w-1/2 flex flex-col p-8 lg:p-12">
            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center pt-16">
              <div className="w-full max-w-md">
                {/* Progress Indicator */}
                <div className="mb-12">
                  <ProgressIndicator currentStep={currentStep} onStepClick={goToStep} />
                </div>

                {/* Main Content */}
                <div>
                  {renderCurrentStep()}
                </div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-end pt-6">
              {currentStep === STEPS.INTRODUCTION && (
                <button
                  className="group min-h-[44px] py-3 px-6 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 disabled:opacity-50"
                  onClick={nextStep}
                  disabled={!displayName.trim()}
                >
                  <span className="text-sm font-semibold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2">
                    Next →
                  </span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
