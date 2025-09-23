"use client";

import React, { useCallback, useEffect, useState } from "react";
import { STEPS } from "@/constants/onboarding";
import IntroductionStep from "./IntroductionStep";
import ProgressIndicator from "./ProgressIndicator";
import LifeStageStep from "./LifeStageStep";
import PrioritiesStep from "./PrioritiesStep";
import YourPathStep from "./YourPathStep";
import { useSecureStorage } from "@/hooks/useSecureStorage";

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

  const updateSelectedLifeStage = (lifeStage: { questionId: number; optionId: number } | null) => {
    setSelectedLifeStage(lifeStage);
    setSecureItem("onboarding-lifeStage", JSON.stringify(lifeStage), 1440); // 24 hours
  };

  const updateSelectedPriorities = (priorities: { questionId: number; optionId: number }[]) => {
    setSelectedPriorities(priorities);
    setSecureItem("onboarding-priorities", JSON.stringify(priorities), 1440); // 24 hours
  };

  const nextStep = useCallback(() => {
    updateCurrentStep(currentStep < STEPS.YOUR_PATH ? currentStep + 1 : currentStep);
  }, [currentStep, updateCurrentStep]);

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

    // Reset onboarding state
    updateCurrentStep(STEPS.INTRODUCTION);
    updateDisplayName("");
    updateSelectedLifeStage(null);
    updateSelectedPriorities([]);
  }, [
    displayName,
    selectedLifeStage,
    selectedPriorities,
    onComplete,
    updateCurrentStep,
    updateDisplayName,
    updateSelectedLifeStage,
    updateSelectedPriorities,
  ]);

  if (!isOpen || !hydrated) return null;

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
            onNext={nextStep}
            onSkip={skipStep}
          />
        );
      case STEPS.PRIORITIES:
        return (
          <PrioritiesStep
            selectedPriorities={selectedPriorities}
            setSelectedPriorities={updateSelectedPriorities}
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
