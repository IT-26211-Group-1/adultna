export interface OnboardingData {
  displayName: string;
  lifeStage: string;
  priorities: string[];
  completedAt: string;
}

export interface StepProps {
  onNext: () => void;
  onSkip?: () => void;
}

export type StepNumber = 1 | 2 | 3 | 4;

export type IntroductionStepProps = {
  displayName: string;
  setDisplayName: (name: string) => void;
  onNext: () => void;
};
