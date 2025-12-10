import { z } from "zod";

export const addQuestionSchema = z
  .object({
    question: z
      .string()
      .min(1, "Question is required")
      .min(10, "Question must be at least 10 characters")
      .max(1000, "Question cannot exceed 1000 characters")
      .transform((val) => val.trim()),
    category: z.enum(["behavioral", "technical", "situational", "background"], {
      message: "Please select a valid category",
    }),
    industry: z.string().min(1, "Industry is required"),
    customIndustry: z.string().optional(),
    source: z.enum(["manual", "ai"]),
    customCategory: z.string().optional(),
    jobRoles: z
      .array(
        z.object({
          jobRoleTitle: z
            .string()
            .transform((val) => val.trim())
            .refine((val) => val !== "", "Job role title cannot be empty")
            .optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If industry is "other", customIndustry is required
      if (data.industry === "other" && !data.customIndustry) {
        return false;
      }

      return true;
    },
    {
      message: "Please specify the industry",
      path: ["customIndustry"],
    },
  )
  .refine(
    (data) => {
      // If category is "background", customCategory is required
      if (data.category === "background" && !data.customCategory) {
        return false;
      }

      return true;
    },
    {
      message: "Please specify the category",
      path: ["customCategory"],
    },
  );

export const editQuestionSchema = z
  .object({
    question: z
      .string()
      .min(1, "Question is required")
      .min(10, "Question must be at least 10 characters")
      .max(1000, "Question cannot exceed 1000 characters")
      .transform((val) => val.trim()),
    category: z.enum(["behavioral", "technical", "situational", "background"], {
      message: "Please select a valid category",
    }),
    industry: z.string().min(1, "Industry is required"),
    customIndustry: z.string().optional(),
    jobRoles: z
      .array(
        z.object({
          jobRoleTitle: z
            .string()
            .transform((val) => val.trim())
            .refine((val) => val !== "", "Job role title cannot be empty")
            .optional(),
        }),
      )
      .optional(),
  })
  .refine(
    (data) => {
      // If industry is "other", customIndustry is required
      if (data.industry === "other" && !data.customIndustry) {
        return false;
      }

      return true;
    },
    {
      message: "Please specify the industry",
      path: ["customIndustry"],
    },
  );

export const generateAIQuestionSchema = z
  .object({
    category: z.enum(["behavioral", "technical", "situational", "background"], {
      message: "Please select a valid category",
    }),
    industry: z.string().min(1, "Industry is required"),
    customIndustry: z.string().optional(),
    customCategory: z.string().optional(),
  })
  .refine(
    (data) => {
      // If industry is "other", customIndustry is required
      if (data.industry === "other" && !data.customIndustry) {
        return false;
      }

      return true;
    },
    {
      message: "Please specify the industry",
      path: ["customIndustry"],
    },
  )
  .refine(
    (data) => {
      // If category is "background", customCategory is required
      if (data.category === "background" && !data.customCategory) {
        return false;
      }

      return true;
    },
    {
      message: "Please specify the category",
      path: ["customCategory"],
    },
  );

export type AddQuestionForm = z.infer<typeof addQuestionSchema>;
export type EditQuestionForm = z.infer<typeof editQuestionSchema>;
export type GenerateAIQuestionForm = z.infer<typeof generateAIQuestionSchema>;
