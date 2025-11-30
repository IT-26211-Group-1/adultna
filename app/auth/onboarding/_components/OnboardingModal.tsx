"use client";

import React, { useCallback, useEffect, useState, Suspense } from "react";
import Image from "next/image";
import { STEPS } from "@/constants/onboarding";
import IntroductionStep from "./IntroductionStep";
import ProgressIndicator from "./ProgressIndicator";
import LifeStageStep from "./LifeStageStep";
import PrioritiesStep from "./PrioritiesStep";
import YourPathStep from "./YourPathStep";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import Lottie from "lottie-react";
import roadmapLoadingAnimation from "../../../../public/roadmap-loading.json";

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => Promise<void>;
  isSubmitting?: boolean;
};

export default function OnboardingModal({
  isOpen,
  onComplete,
  isSubmitting: _isSubmitting = false,
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
              <div className="w-64 h-64 mx-auto mb-4 flex items-center justify-center">
                <Suspense
                  fallback={
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600" />
                  }
                >
                  <Lottie
                    animationData={roadmapLoadingAnimation}
                    autoplay={true}
                    loop={true}
                    rendererSettings={{
                      preserveAspectRatio: "xMidYMid slice",
                    }}
                    style={{ width: "100%", height: "100%" }}
                    onDOMLoaded={() =>
                      console.log("Animation loaded successfully")
                    }
                  />
                </Suspense>
              </div>
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
          />
        );
      case STEPS.PRIORITIES:
        return (
          <PrioritiesStep
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={updateSelectedPriorities}
          />
        );
      case STEPS.YOUR_PATH:
        return <YourPathStep />;
      default:
        return null;
    }
  };

  // Mobile Layout (screens < 640px)
  const renderMobileLayout = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-h-[95vh] overflow-hidden flex flex-col h-full max-w-md">
        {/* Mobile Content */}
        <div className="flex-1 flex flex-col p-4 overflow-y-auto">
          {/* Progress Indicator */}
          <div className="mb-4 mt-2">
            <ProgressIndicator
              currentStep={currentStep}
              onStepClick={goToStep}
            />
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-sm">{renderCurrentStep()}</div>
          </div>
        </div>

        {/* Mobile Footer Navigation */}
        <div className="flex justify-between p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2">
            {currentStep > STEPS.INTRODUCTION && (
              <button
                className="min-h-[44px] py-2 px-4 border border-gray-400 hover:border-gray-500 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full font-semibold transition-all duration-200 focus:outline-none text-sm"
                onClick={previousStep}
              >
                ← Back
              </button>
            )}
            {(currentStep === STEPS.LIFE_STAGE ||
              currentStep === STEPS.PRIORITIES) && (
              <button
                className="text-gray-500 hover:text-gray-700 px-4 py-2 font-medium transition-colors rounded-full text-sm"
                onClick={skipStep}
              >
                Skip
              </button>
            )}
          </div>

          <div>
            {currentStep === STEPS.INTRODUCTION && (
              <button
                className="min-h-[44px] py-2 px-4 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50 text-sm"
                disabled={!displayName.trim()}
                onClick={nextStep}
              >
                <span className="font-semibold text-white">Next →</span>
              </button>
            )}

            {currentStep === STEPS.LIFE_STAGE && (
              <button
                className="min-h-[44px] py-2 px-4 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50 text-sm"
                disabled={!selectedLifeStage}
                onClick={nextStep}
              >
                <span className="font-semibold text-white">Next →</span>
              </button>
            )}

            {currentStep === STEPS.PRIORITIES && (
              <button
                className="min-h-[44px] py-2 px-4 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none disabled:opacity-50 text-sm"
                disabled={selectedPriorities.length === 0}
                onClick={nextStep}
              >
                <span className="font-semibold text-white">Next →</span>
              </button>
            )}

            {currentStep === STEPS.YOUR_PATH && (
              <button
                className="min-h-[44px] py-2 px-4 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none text-sm"
                onClick={() =>
                  handleComplete({
                    displayName: displayName || undefined,
                    ...(selectedLifeStage
                      ? {
                          questionId: selectedLifeStage.questionId,
                          optionId: selectedLifeStage.optionId,
                        }
                      : {}),
                    priorities: selectedPriorities,
                  })
                }
              >
                <span className="font-semibold text-white">Get Started</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  // Desktop/Tablet Layout (screens >= 640px)
  const renderDesktopLayout = () => (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 lg:p-6 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-full max-h-[95vh] overflow-hidden">
        <div className="flex flex-col lg:flex-row h-full min-h-[700px]">
          {/* Left Panel - Visual Storytelling */}
          <div className="hidden sm:flex lg:w-1/2 bg-gradient-to-br from-yellow-50 via-teal-50 to-blue-50 p-6 sm:p-8 lg:p-12 flex-col justify-center relative overflow-hidden">
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
                      We&apos;re here to help you navigate adulthood with
                      confidence. Let&apos;s start by getting to know you
                      better.
                    </p>
                    <div className="bg-teal-500/10 border border-teal-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse" />
                        <span className="font-medium">
                          Step 1 of 4 • Takes about 2 minutes
                        </span>
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
                      Understanding where you are in life helps us personalize
                      your roadmap and suggest the most relevant resources for
                      your journey.
                    </p>
                    <div className="bg-teal-500/10 border border-teal-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse" />
                        <span className="font-medium">
                          Step 2 of 4 • Almost there!
                        </span>
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
                      Your priorities shape your path. Choose what you&apos;d
                      like to focus on, and we&apos;ll customize your experience
                      accordingly.
                    </p>
                    <div className="bg-teal-500/10 border border-teal-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <div className="w-3 h-3 bg-teal-600 rounded-full animate-pulse" />
                        <span className="font-medium">
                          Step 3 of 4 • You&apos;re doing great!
                        </span>
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
                      Perfect! We&apos;ve got everything we need to create your
                      personalized roadmap. Your journey to organized adulthood
                      starts now.
                    </p>
                    <div className="bg-green-500/10 border border-green-200 rounded-xl p-4">
                      <div className="flex items-center gap-3 text-sm text-gray-800">
                        <div className="w-3 h-3 bg-green-600 rounded-full animate-pulse" />
                        <span className="font-medium">
                          Final Step • Let&apos;s get started!
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Visual Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Progress</span>
                  <span>
                    {Math.round((currentStep / STEPS.YOUR_PATH) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <div
                    className="bg-adult-green h-2 rounded-full transition-all duration-500 ease-out"
                    style={{
                      width: `${(currentStep / STEPS.YOUR_PATH) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Panel - Interactive Content */}
          <div className="w-full lg:w-1/2 flex flex-col p-4 sm:p-6 lg:p-8 xl:p-12 overflow-y-auto">
            {/* Content Area */}
            <div className="flex-1 flex flex-col items-center pt-4 sm:pt-8 lg:pt-16">
              <div className="w-full max-w-md px-4 sm:px-0">
                {/* Progress Indicator */}
                <div className="mb-6">
                  <ProgressIndicator
                    currentStep={currentStep}
                    onStepClick={goToStep}
                  />
                </div>

                {/* Main Content */}
                <div>{renderCurrentStep()}</div>
              </div>
            </div>

            {/* Footer Navigation */}
            <div className="flex justify-between pt-4 sm:pt-6 px-4 sm:px-0 pb-4 sm:pb-0 bg-white mt-auto">
              <div className="flex gap-2 flex-shrink-0">
                {currentStep > STEPS.INTRODUCTION && (
                  <button
                    className="group min-h-[44px] py-2 sm:py-3 px-4 sm:px-6 border border-gray-400 hover:border-gray-500 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900 rounded-full font-semibold transition-all duration-200 focus:outline-none text-sm sm:text-base"
                    onClick={previousStep}
                  >
                    <span className="text-sm font-semibold transition-colors duration-200 inline-flex items-center justify-center gap-2">
                      ← Back
                    </span>
                  </button>
                )}
                {(currentStep === STEPS.LIFE_STAGE ||
                  currentStep === STEPS.PRIORITIES) && (
                  <button
                    className="text-gray-500 hover:text-gray-700 px-4 sm:px-6 py-2 sm:py-3 font-medium transition-colors rounded-full text-sm sm:text-base"
                    onClick={skipStep}
                  >
                    Skip
                  </button>
                )}
              </div>

              <div>
                {currentStep === STEPS.INTRODUCTION && (
                  <button
                    className="group min-h-[44px] py-2 sm:py-3 px-4 sm:px-6 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none  disabled:opacity-50 text-sm sm:text-base"
                    disabled={!displayName.trim()}
                    onClick={nextStep}
                  >
                    <span className="text-sm font-semibold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2">
                      Next →
                    </span>
                  </button>
                )}

                {currentStep === STEPS.LIFE_STAGE && (
                  <button
                    className="group min-h-[44px] py-2 sm:py-3 px-4 sm:px-6 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none  disabled:opacity-50 text-sm sm:text-base"
                    disabled={!selectedLifeStage}
                    onClick={nextStep}
                  >
                    <span className="text-sm font-semibold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2">
                      Next →
                    </span>
                  </button>
                )}

                {currentStep === STEPS.PRIORITIES && (
                  <button
                    className="group min-h-[44px] py-2 sm:py-3 px-4 sm:px-6 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none  disabled:opacity-50 text-sm sm:text-base"
                    disabled={selectedPriorities.length === 0}
                    onClick={nextStep}
                  >
                    <span className="text-sm font-semibold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2">
                      Next →
                    </span>
                  </button>
                )}

                {currentStep === STEPS.YOUR_PATH && (
                  <button
                    className="group min-h-[44px] py-2 sm:py-3 px-4 sm:px-6 bg-teal-700 rounded-full hover:bg-teal-800 hover:shadow-lg transition-all duration-200 focus:outline-none text-sm sm:text-base"
                    onClick={() =>
                      handleComplete({
                        displayName: displayName || undefined,
                        ...(selectedLifeStage
                          ? {
                              questionId: selectedLifeStage.questionId,
                              optionId: selectedLifeStage.optionId,
                            }
                          : {}),
                        priorities: selectedPriorities,
                      })
                    }
                  >
                    <span className="text-sm font-semibold text-white transition-colors duration-200 inline-flex items-center justify-center gap-2">
                      Get Started
                    </span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Layout */}
      <div className="sm:hidden">{renderMobileLayout()}</div>

      {/* Desktop/Tablet Layout */}
      <div className="hidden sm:block">{renderDesktopLayout()}</div>
    </>
  );
}
