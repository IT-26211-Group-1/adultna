"use client";

import React, { useState, useCallback } from "react";
import { X } from "lucide-react";
import { STEPS } from "@/constants/onboarding";
import IntroductionStep from "./IntroductionStep";
import ProgressIndicator from "./ProgressIndicator";
import LifeStageStep from "./LifeStageStep";
import PrioritiesStep from "./PrioritiesStep";
import YourPathStep from "./YourPathStep";

type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
};

export default function OnboardingModal({
  isOpen,
  onClose,
  onComplete,
}: OnboardingModalProps) {
  const [currentStep, setCurrentStep] = useState<number>(STEPS.INTRODUCTION);
  const [displayName, setDisplayName] = useState("");
  const [selectedLifeStage, setSelectedLifeStage] = useState("");
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  const nextStep = useCallback(() => {
    setCurrentStep((prev) => (prev < 4 ? prev + 1 : prev));
  }, []);

  const skipStep = useCallback(() => {
    nextStep();
  }, [nextStep]);

  const handleComplete = useCallback(() => {
    const onboardingData = {
      displayName,
      lifeStage: selectedLifeStage,
      priorities: selectedPriorities,
      completedAt: new Date().toISOString(),
    };
    onComplete(onboardingData);
  }, [displayName, selectedLifeStage, selectedPriorities, onComplete]);

  const handleClose = useCallback(() => {
    if (currentStep !== STEPS.INTRODUCTION) {
      onClose();
    }
  }, [currentStep, onClose]);

  if (!isOpen) return null;

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
        return <YourPathStep onComplete={handleComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-teal-700">AdultNa.</h1>
            {currentStep !== STEPS.INTRODUCTION && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
          <ProgressIndicator currentStep={currentStep} />
        </div>

        <div className="p-8">{renderCurrentStep()}</div>
      </div>
    </div>
  );
}
