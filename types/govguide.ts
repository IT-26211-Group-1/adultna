export type GuideStatus = "review" | "published" | "archived";

export type GuideCategory =
  | "ID"
  | "Clearance"
  | "Benefit"
  | "Tax Document"
  | "License";

export type GovGuide = {
  id: string;
  slug: string;
  title: string;
  issuingAgency: string;
  category: GuideCategory;
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
};
