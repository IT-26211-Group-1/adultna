export type GenerateWorkDescriptionInput = {
  jobTitle?: string;
  employer?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isCurrentlyWorkingHere?: boolean;
  existingDescription?: string;
};

export type GenerateWorkDescriptionResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  suggestions?: string[];
};

export type GenerateSkillsSuggestionsInput = {
  jobPosition?: string;
  workExperiences?: Array<{
    jobTitle?: string;
    employer?: string;
    description?: string;
  }>;
  educationItems?: Array<{
    degree?: string;
    institution?: string;
    fieldOfStudy?: string;
  }>;
  existingSkills?: string[];
};

export type GenerateSkillsSuggestionsResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  suggestions?: string[];
};
