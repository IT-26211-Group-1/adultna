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

export type QuestionOption = {
  id: number;
  optionText: string;
  outcomeId?: number;
};

export type Question = {
  id: number;
  question: string;
  category: string;
  options: QuestionOption[];
};

export type OnboardingApiResponse = {
  success: boolean;
  data: Question[] | { questions: Question[] };
  message?: string;
};

export type PrioritiesStepProps = {
  selectedPriorities: string[];
  setSelectedPriorities: React.Dispatch<React.SetStateAction<string[]>>;
  onNext: () => void;
  onSkip: () => void;
};

export type YourPathStepProps = {
  userId: string;
  lifeStage: string;
  priorities: string[];
  onComplete: () => void;
};
