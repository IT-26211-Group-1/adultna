export type TemplateId = "reverse-chronological" | "modern" | "skill-based" | "hybrid";

export type CoverLetterStatus = "draft" | "completed" | "archived";

export type CoverLetterStyle = "formal" | "conversational" | "modern";

export type SectionType = "salutation" | "intro" | "body1" | "body2" | "body3" | "closing" | "signature";

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
  templateId: TemplateId;
  status: CoverLetterStatus;
  style: CoverLetterStyle;
  targetCompany?: string;
  targetPosition?: string;
  jobDescription?: string;
  content?: string;
  aiGenerated: boolean;
  sections: CoverLetterSection[];
  createdAt: string;
  updatedAt: string;
};

export type CreateCoverLetterInput = {
  title: string;
  resumeId?: string;
  templateId: TemplateId;
  status: CoverLetterStatus;
  style: CoverLetterStyle;
  targetCompany?: string;
  targetPosition?: string;
  jobDescription?: string;
  content?: string;
  sections?: CoverLetterSection[];
  aiGenerated?: boolean;
};

export type UpdateCoverLetterInput = {
  title?: string;
  templateId?: TemplateId;
  status?: CoverLetterStatus;
  style?: CoverLetterStyle;
  targetCompany?: string;
  targetPosition?: string;
  jobDescription?: string;
  content?: string;
};

export type GenerateUploadUrlResponse = {
  uploadUrl: string;
  fileKey: string;
};

export type ImportResumeInput = {
  fileKey: string;
  fileName: string;
  title: string;
  targetCompany?: string;
  targetPosition?: string;
  jobDescription?: string;
  style: CoverLetterStyle;
};

export type ImproveCoverLetterInput = {
  currentContent: string;
  feedback: string;
  style?: CoverLetterStyle;
};

export type ChangeToneInput = {
  currentContent: string;
  newStyle: CoverLetterStyle;
};

export type AIImprovement = {
  improvedContent: string;
  suggestions: string[];
};
