"use client";

import React, { useCallback, useEffect, useState } from "react";
import { STEPS } from "@/constants/onboarding";
import IntroductionStep from "./IntroductionStep";
import ProgressIndicator from "./ProgressIndicator";
import LifeStageStep from "./LifeStageStep";
import PrioritiesStep from "./PrioritiesStep";
import YourPathStep from "./YourPathStep";
import { useLocalStorage } from "@/hooks/useLocalStorage";

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
};

export default function OnboardingModal({
  isOpen,
  onComplete,
}: OnboardingModalProps) {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const [currentStep, setCurrentStep] = useLocalStorage<number>(
    "onboarding-currentStep",
    STEPS.INTRODUCTION,
  );
  const [displayName, setDisplayName] = useLocalStorage<string>(
    "onboarding-displayName",
    "",
  );
  const [selectedLifeStage, setSelectedLifeStage] = useLocalStorage<{
    questionId: number;
    optionId: number;
  } | null>("onboarding-lifeStage", null);
  const [selectedPriorities, setSelectedPriorities] = useLocalStorage<
    { questionId: number; optionId: number }[]
  >("onboarding-priorities", []);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < STEPS.YOUR_PATH ? prev + 1 : prev));
  }, [setCurrentStep]);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleComplete = useCallback(() => {
    const payload = {
      displayName: displayName || undefined,
      ...(selectedLifeStage
        ? {
            questionId: selectedLifeStage.questionId,
            optionId: selectedLifeStage.optionId,
          }
        : {}),
      priorities: selectedPriorities,
    };

    onComplete(payload);

    setCurrentStep(STEPS.INTRODUCTION);
    setDisplayName("");
    setSelectedLifeStage(null);
    setSelectedPriorities([]);
  }, [
    displayName,
    selectedLifeStage,
    selectedPriorities,
    onComplete,
    setCurrentStep,
    setDisplayName,
    setSelectedLifeStage,
    setSelectedPriorities,
  ]);

  if (!isOpen || !hydrated) return null;

  const renderCurrentStep = () => {
    switch (currentStep) {
      case STEPS.INTRODUCTION:
        return (
          <IntroductionStep
            displayName={displayName}
            setDisplayName={setDisplayName}
            onNext={nextStep}
          />
        );
      case STEPS.LIFE_STAGE:
        return (
          <LifeStageStep
            selectedLifeStage={selectedLifeStage}
            setSelectedLifeStage={setSelectedLifeStage}
            onNext={nextStep}
            onSkip={skipStep}
          />
        );
      case STEPS.PRIORITIES:
        return (
          <PrioritiesStep
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={setSelectedPriorities}
            onNext={nextStep}
            onSkip={skipStep}
          />
        );
      case STEPS.YOUR_PATH:
        return (
          <YourPathStep
            displayName={displayName}
            lifeStage={selectedLifeStage}
            priorities={selectedPriorities}
            onComplete={handleComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-teal-700">AdultNa.</h1>
          </div>
          <ProgressIndicator currentStep={currentStep} />
        </div>
        <div className="p-8">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
