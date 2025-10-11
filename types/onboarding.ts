export interface OnboardingData {
  displayName?: string;
  questionId?: number;
  optionId?: number;
  priorities?: { questionId: number; optionId: number }[];
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
  selectedPriorities: { questionId: number; optionId: number }[];
  setSelectedPriorities: React.Dispatch<
    React.SetStateAction<{ questionId: number; optionId: number }[]>
  >;
  onNext: () => void;
  onSkip: () => void;
};

export type YourPathStepProps = {
  displayName: string;
  lifeStage: { questionId: number; optionId: number } | null;
  priorities: { questionId: number; optionId: number }[];
  onComplete: (data: OnboardingData) => Promise<void>;
  isSubmitting?: boolean;
};

// Admin Form Types
export type OptionField = {
  optionText: string;
  outcomeTagName?: string;
};

export type AddQuestionForm = {
  question: string;
  category: string;
  options: OptionField[];
  optionsText?: string;
};

export type EditQuestionForm = {
  question?: string;
  category?: string;
};

// Admin Modal Props Types
export type AddOnboardingQuestionModalProps = {
  open?: boolean;
  onClose?: () => void;
  onQuestionCreated?: () => void;
};

export type EditOnboardingQuestionModalProps = {
  open?: boolean;
  onClose?: () => void;
  onQuestionUpdated?: () => void;
  questionId: number;
};
