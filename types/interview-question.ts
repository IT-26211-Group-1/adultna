export type QuestionStatus = "pending" | "approved" | "rejected" | "to_revise";

export type QuestionCategory =
  | "behavioral"
  | "technical"
  | "situational"
  | "background";

export type QuestionSource = "ai" | "manual";

export type InterviewQuestion = {
  id: string;
  question: string;
  category: QuestionCategory;
  industry?: string | null;
  source: QuestionSource;
  status: QuestionStatus;
  createdBy: string;
  updatedBy: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  deletedBy: string | null;
  createdByEmail?: string | null;
  updatedByEmail?: string | null;
  deletedByEmail?: string | null;
  reason?: string | null;
};

export type CreateQuestionRequest = {
  question: string;
  category: QuestionCategory;
  industry?: string;
  source: QuestionSource;
};

export type CreateQuestionResponse = {
  success: boolean;
  message: string;
  data?: InterviewQuestion;
};

export type UpdateQuestionRequest = {
  questionId: string;
  question?: string;
  category?: QuestionCategory;
  industry?: string;
  source?: QuestionSource;
};

export type UpdateQuestionResponse = {
  success: boolean;
  message: string;
  data?: InterviewQuestion;
};

export type UpdateQuestionStatusRequest = {
  questionId: string;
  status: QuestionStatus;
  reason?: string;
};

export type UpdateQuestionStatusResponse = {
  success: boolean;
  message: string;
  data?: InterviewQuestion;
};

export type ListQuestionsParams = {
  category?: QuestionCategory;
  status?: QuestionStatus;
  source?: QuestionSource;
  search?: string;
  limit?: number;
  offset?: number;
};

export type ListQuestionsResponse = {
  success: boolean;
  data?: {
    questions: InterviewQuestion[];
    total: number;
    limit: number;
    offset: number;
  };
  message?: string;
};

export type DeleteQuestionResponse = {
  success: boolean;
  message: string;
};

export type RestoreQuestionResponse = {
  success: boolean;
  message: string;
  data?: InterviewQuestion;
};

export type GenerateAIQuestionRequest = {
  category: QuestionCategory;
  industry?: string;
};

export type GenerateAIQuestionResponse = {
  success: boolean;
  message: string;
  data?: InterviewQuestion;
};

export type QuestionsTableProps = {
  onEditQuestion?: (questionId: string) => void;
};
