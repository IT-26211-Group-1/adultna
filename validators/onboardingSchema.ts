import { z } from "zod";

export const onboardingOptionSchema = z.object({
  optionText: z
    .string()
    .min(1, "Option text is required")
    .min(2, "Option text must be at least 2 characters")
    .max(100, "Option text cannot exceed 100 characters")
    .transform((val) => val.trim()),
  outcomeTagName: z
    .string()
    .optional()
    .transform((val) => val?.trim()),
});

export const addOnboardingQuestionSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question cannot exceed 500 characters")
    .transform((val) => val.trim()),
  category: z.enum(["life_stage", "priorities"], {
    message: "Please select a valid category",
  }),
  options: z
    .array(onboardingOptionSchema)
    .min(2, "At least 2 options are required")
    .max(10, "Cannot have more than 10 options"),
});

export const editOnboardingQuestionSchema = z.object({
  question: z
    .string()
    .min(1, "Question is required")
    .min(5, "Question must be at least 5 characters")
    .max(500, "Question cannot exceed 500 characters")
    .transform((val) => val.trim()),
  category: z.enum(["life_stage", "priorities"], {
    message: "Please select a valid category",
  }),
  options: z
    .array(onboardingOptionSchema)
    .min(2, "At least 2 options are required")
    .max(10, "Cannot have more than 10 options"),
});

export type AddOnboardingQuestionForm = z.infer<
  typeof addOnboardingQuestionSchema
>;
export type EditOnboardingQuestionForm = z.infer<
  typeof editOnboardingQuestionSchema
>;
export type OnboardingOptionForm = z.infer<typeof onboardingOptionSchema>;
