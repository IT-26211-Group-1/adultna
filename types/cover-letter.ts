export type CoverLetterStatus = "draft" | "completed" | "archived";

export type CoverLetterTone = "professional" | "formal" | "conversational" | "modern";

export type SectionType = "intro" | "body" | "conclusion" | "signature";

export type CoverLetterSection = {
  id?: string;
  sectionType: SectionType;
  content: string;
  order: number;
};

export type CoverLetter = {
  id: string;
  userId: string;
  resumeId?: string;
  title: string;
  status: CoverLetterStatus;
  tone: CoverLetterTone;
  sections: CoverLetterSection[];
  createdAt: string;
  updatedAt: string;
};

export type CreateCoverLetterInput = {
  title: string;
  resumeId?: string;
  status: CoverLetterStatus;
  tone?: CoverLetterTone;
  sections?: CoverLetterSection[];
};

export type UpdateCoverLetterInput = {
  title?: string;
  status?: CoverLetterStatus;
};

export type GenerateUploadUrlResponse = {
  uploadUrl: string;
  fileKey: string;
};

export type ImportResumeInput = {
  fileKey: string;
  fileName: string;
  title: string;
  style?: CoverLetterStyle;
};

export type ImproveCoverLetterInput = {
  currentContent: string;
  feedback: string;
};

export type ChangeToneInput = {
  currentContent: string;
  newStyle: CoverLetterStyle;
};

export type AIImprovement = {
  improvedContent: string;
  suggestions: string[];
};

export type CoverLetterStyle = CoverLetterTone;
