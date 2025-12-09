import { z } from "zod";

export const addFeedbackSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .transform((val) => val.trim()),
  type: z.enum(["report", "feedback"], {
    message: "Please select a valid type",
  }),
  feature: z.enum(
    [
      "govmap",
      "filebox",
      "process_guides",
      "ai_gabay_agent",
      "mock_interview_coach",
    ],
    {
      message: "Please select a valid feature",
    },
  ),
});

export const editFeedbackSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title cannot exceed 200 characters")
    .transform((val) => val.trim()),
  description: z
    .string()
    .min(1, "Description is required")
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description cannot exceed 2000 characters")
    .transform((val) => val.trim()),
  type: z.enum(["report", "feedback"], {
    message: "Please select a valid type",
  }),
  feature: z.enum(
    [
      "govmap",
      "filebox",
      "process_guides",
      "ai_gabay_agent",
      "mock_interview_coach",
    ],
    {
      message: "Please select a valid feature",
    },
  ),
});

export type AddFeedbackForm = z.infer<typeof addFeedbackSchema>;
export type EditFeedbackForm = z.infer<typeof editFeedbackSchema>;
