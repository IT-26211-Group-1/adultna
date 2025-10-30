import { z } from "zod";

const nameSchema = (field: string) =>
  z
    .string()
    .min(1, `${field} is required`)
    .refine(
      (val) => val === val.trim(),
      `${field} cannot start or end with spaces`,
    )
    .refine(
      (val) => val.trim().length >= 2,
      `${field} must be at least 2 characters`,
    )
    .refine(
      (val) => !/\s{2,}/.test(val),
      `${field} cannot contain multiple consecutive spaces`,
    )
    .max(30, `${field} must be less than 30 characters`)
    .regex(
      /^[a-zA-Z\s'-]+$/,
      `${field} can only contain letters, spaces, hyphens, and apostrophes`,
    );

const displayNameSchema = z
  .string()
  .min(1, "Display name is required")
  .min(2, "Display name must be at least 2 characters")
  .max(30, "Display name must be less than 30 characters")
  .refine(
    (val) => val === val.trim(),
    "Display name cannot start or end with spaces",
  );

const emailSchema = z
  .string()
  .email({ message: "Please enter a valid email address" })
  .min(1, "Email is required")
  .refine((val) => val === val.trim(), "Email cannot start or end with spaces")
  .refine((val) => !/\s/.test(val), "Email cannot contain any spaces")
  .max(100, "Email must be less than 100 characters")
  .refine((val) => !val.includes(".."), "Email cannot contain consecutive dots")
  .refine(
    (val) => !val.startsWith(".") && !val.endsWith("."),
    "Email cannot start or end with a dot",
  );

const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(50, "Password must be less than 50 characters")
  .regex(/^(?=.*[a-z])/, "Password must contain at least one lowercase letter")
  .regex(/^(?=.*[A-Z])/, "Password must contain at least one uppercase letter")
  .regex(/^(?=.*\d)/, "Password must contain at least one number")
  .regex(
    /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
    "Password must contain at least one special character",
  )
  .refine((val) => !/\s/.test(val), "Password cannot contain spaces")
  .refine(
    (val) => !/(.)\1{2,}/.test(val),
    "Password cannot have more than 2 consecutive identical characters",
  );

export const profileUpdateSchema = z.object({
  displayName: displayNameSchema,
  firstName: nameSchema("First name"),
  lastName: nameSchema("Last name"),
  email: emailSchema,
});

export const passwordUpdateSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, "Current password is required")
      .min(8, "Password must be at least 8 characters"),
    newPassword: strongPasswordSchema,
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type ProfileUpdateInput = z.infer<typeof profileUpdateSchema>;
export type PasswordUpdateInput = z.infer<typeof passwordUpdateSchema>;
