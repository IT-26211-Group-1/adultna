export type InterviewAnswerScores = {
  starCompleteness: number;
  actionSpecificity: number;
  resultQuantification: number;
  relevanceToRole: number;
  deliveryFluency: number;
};

export type StarFeedback = {
  situation: string | null;
  task: string | null;
  action: string | null;
  result: string | null;
  overall: string;
};

export type InterviewAnswerEvaluation = {
  starFeedback: StarFeedback;
  strengths: string[];
  areasForImprovement: string[];
  actionableRecommendations: string[];
};

export type AnswerStatus = "pending" | "processing" | "completed" | "failed";

export type InterviewAnswer = {
  id: string;
  sessionQuestionId: string;
  userId: string;
  transcriptJobName: string | null;
  status: AnswerStatus;
  gradingProgress: number;
  scores: InterviewAnswerScores | null;
  totalScore: number | null;
  percentageScore: number | null;
  contentS3Key: string | null;
  audioS3Key: string | null;
  createdAt: string;
  evaluatedAt: string | null;
  questionText?: string;
  userAnswer?: string;
  evaluation?: InterviewAnswerEvaluation;
};

export type SubmitAnswerRequest = {
  sessionQuestionId: string;
  userAnswer: string;
  transcriptJobName?: string;
};

export type SubmitAnswerResponse = InterviewAnswer;
