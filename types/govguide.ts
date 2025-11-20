export type GuideStatus = "pending" | "rejected" | "to_revise" | "accepted";

export type GuideCategory =
  | "identification"
  | "civil-registration"
  | "permits-licenses"
  | "social-services"
  | "tax-related"
  | "legal"
  | "other";

export type OfficeInfo = {
  issuingAgency: string;
  locations?: string[];
  latitude?: number;
  longitude?: number;
  feeAmount?: number;
  feeCurrency?: string;
  oneTimeFee?: boolean;
};

export type ProcessStep = {
  stepNumber: number;
  title: string;
  description?: string;
  estimatedTime?: string;
};

export type DocumentRequirement = {
  name: string;
  description?: string;
  isRequired?: boolean;
};

export type GeneralTips = {
  tipsToFollow?: string[];
  tipsToAvoid?: string[];
  importantReminders?: string[];
};

export type GovGuide = {
  id: string;
  slug: string;
  title: string;
  issuingAgency: string;
  category: GuideCategory;
  customCategory: string | null;
  summary: string | null;
  estimatedProcessingTime: string | null;
  processingTime?: string | null;
  feeAmount: number | null;
  feeCurrency: string;
  oneTimeFee: boolean;
  status: GuideStatus;
  isActive: boolean;
  stepsCount: number;
  requirementsCount: number;
  createdAt: string;
  updatedAt: string;
  updatedBy: string | null;
  updatedByEmail: string | null;
  createdByEmail: string | null;
  offices?: OfficeInfo;
  steps?: ProcessStep[];
  requirements?: DocumentRequirement[];
  generalTips?: GeneralTips | null;
};
