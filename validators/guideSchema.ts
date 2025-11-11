import { z } from "zod";

export const guideStepSchema = z.object({
  stepNumber: z.number().min(1),
  title: z.string().min(1, "Step title is required"),
});

export const guideRequirementSchema = z.object({
  name: z.string().min(1, "Requirement name is required"),
  description: z.string().optional(),
});

export const addGuideSchema = z.object({
  title: z.string().min(1, "Guide title is required"),
  issuingAgency: z.string().min(1, "Issuing agency is required"),
  summary: z.string().optional(),
  estimatedProcessingTime: z.string().optional(),
  feeAmount: z.number().min(0).optional().nullable(),
  feeCurrency: z.string().default("PHP"),
  status: z.enum(["review", "published", "archived"]).default("review"),
  steps: z.array(guideStepSchema).min(1, "At least one step is required"),
  requirements: z.array(guideRequirementSchema).min(1, "At least one requirement is required"),
});

export type AddGuideForm = z.infer<typeof addGuideSchema>;
export type GuideStepForm = z.infer<typeof guideStepSchema>;
export type GuideRequirementForm = z.infer<typeof guideRequirementSchema>;
