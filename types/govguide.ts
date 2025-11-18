export type GuideStatus = "pending" | "rejected" | "to_revise" | "accepted";

export type GuideCategory =
  | "identification"
  | "civil-registration"
  | "permits-licenses"
  | "social-services"
  | "tax-related"
  | "legal"
  | "other";

export type GovGuide = {
  id: string;
  slug: string;
  title: string;
  issuingAgency: string;
  category: GuideCategory;
  customCategory: string | null;
  summary: string | null;
  estimatedProcessingTime: string | null;
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
  offices?: any;
  steps?: any;
  requirements?: any;
};
