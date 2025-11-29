import { z } from "zod";

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Task title is required")
    .max(100, "Task title must not exceed 100 characters"),
});

export const createMilestoneSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(60, "Title must not exceed 60 characters"),
  description: z
    .string()
    .trim()
    .max(200, "Description must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  priority: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
      { message: "The deadline must be set to a future date." },
    ),
  tasks: z
    .array(taskSchema)
    .max(5, "Maximum 5 tasks allowed per milestone")
    .optional(),
});

export const updateMilestoneSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(60, "Title must not exceed 60 characters")
    .optional(),
  description: z
    .string()
    .trim()
    .max(200, "Description must not exceed 200 characters")
    .optional()
    .or(z.literal("")),
  category: z.string().optional(),
  priority: z.string().optional(),
  deadline: z
    .string()
    .optional()
    .refine(
      (date) => {
        if (!date) return true;
        const selectedDate = new Date(date);
        const today = new Date();

        today.setHours(0, 0, 0, 0);

        return selectedDate >= today;
      },
      { message: "Deadline cannot be in the past" },
    ),
  status: z.enum(["pending", "in_progress", "done", "cancelled"]).optional(),
});

export type CreateMilestoneInput = z.infer<typeof createMilestoneSchema>;
export type UpdateMilestoneInput = z.infer<typeof updateMilestoneSchema>;
export type TaskInput = z.infer<typeof taskSchema>;
