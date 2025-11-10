import { TemplateId } from "../constants/templates";

export type ResumeStatus = "draft" | "completed" | "archived";

export type WorkExperience = {
  id?: string;
  jobTitle?: string;
  employer?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isCurrentlyWorkingHere?: boolean;
  description?: string;
  order?: number;
};

export type Education = {
  id?: string;
  schoolName?: string;
  schoolLocation?: string;
  degree?: string;
  fieldOfStudy?: string;
  graduationDate?: Date | string;
  order?: number;
};

export type Certification = {
  id?: string;
  certificate: string;
  issuingOrganization?: string;
  order?: number;
};

export type Skill = {
  id?: string;
  skill: string;
  proficiency?: number;
  order?: number;
};

export type Resume = {
  id: string;
  userId: string;
  title: string;
  templateId: TemplateId;
  status: ResumeStatus;

  firstName: string;
  lastName: string;
  jobPosition?: string;
  email: string;
  phone: string;
  city?: string;
  region?: string;
  birthDate?: Date | string;
  linkedin?: string;
  portfolio?: string;

  workExperiences?: WorkExperience[];
  educationItems?: Education[];
  certificates?: Certification[];
  skills?: Skill[];
  summary?: string;

  colorHex?: string;

  createdAt: Date | string;
  updatedAt: Date | string;
};

export type CreateResumeInput = Omit<
  Resume,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

export type UpdateResumeInput = Partial<
  Omit<Resume, "id" | "userId" | "createdAt" | "updatedAt">
>;

export type GenerateWorkDescriptionInput = {
  jobTitle?: string;
  employer?: string;
  startDate?: Date | string;
  endDate?: Date | string;
  isCurrentlyWorkingHere?: boolean;
};

export type GenerateWorkDescriptionResponse = {
  success: boolean;
  message: string;
  statusCode: number;
  suggestions?: string[];
};
