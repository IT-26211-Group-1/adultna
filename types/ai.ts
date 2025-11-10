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
