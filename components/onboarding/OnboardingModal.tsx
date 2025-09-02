import React, { useState } from 'react';
import { X, ChevronRight } from 'lucide-react';
import { STEPS } from '@/constants/onboarding';
import IntroductionStep from './steps/IntroductionStep';
import ProgressIndicator from './ProgressIndicator';
import LifeStageStep from './steps/LifeStageStep';
import PrioritiesStep from './steps/PrioritiesStep';
import YourPathStep from './steps/YourPathStep';

// Main Onboarding Modal Component
type OnboardingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (data: any) => void;
};

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose, onComplete }) => {
  const [currentStep, setCurrentStep] = useState<number>(STEPS.INTRODUCTION);
  const [displayName, setDisplayName] = useState('');
  const [selectedLifeStage, setSelectedLifeStage] = useState('');
  const [selectedPriorities, setSelectedPriorities] = useState<string[]>([]);

  // Navigation functions
  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const skipStep = () => {
    nextStep();
  };

  const handleComplete = () => {
    // Here you would typically save the onboarding data to AWS
    const onboardingData = {
      displayName,
      lifeStage: selectedLifeStage,
      priorities: selectedPriorities,
      completedAt: new Date().toISOString()
    };
    
    console.log('Onboarding completed with data:', onboardingData);
    // Call your AWS API here to save the data
    
    onComplete(onboardingData);
  };

  const handleClose = () => {
    // Only allow closing if not on step 1 (Introduction is required)
    if (currentStep !== STEPS.INTRODUCTION) {
      onClose();
    }
  };

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
        return (
          <YourPathStep onComplete={handleComplete} />
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-teal-700">AdultNa.</h1>
            {/* Only show close button if not on step 1 */}
            {currentStep !== STEPS.INTRODUCTION && (
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            )}
          </div>
          <ProgressIndicator currentStep={currentStep} totalSteps={4} />
        </div>

        {/* Content */}
        <div className="p-8">
          {renderCurrentStep()}
        </div>
      </div>
    </div>
  );
};

export default OnboardingModal;