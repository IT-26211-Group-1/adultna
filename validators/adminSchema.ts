import { z } from "zod";

export const addUserSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "First name can only contain letters, spaces, hyphens, and apostrophes")
    .transform((val) => val.trim()),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name cannot exceed 50 characters")
    .regex(/^[a-zA-Z\s'-]+$/, "Last name can only contain letters, spaces, hyphens, and apostrophes")
    .transform((val) => val.trim()),
  email: z
    .string()
    .min(1, "Email address is required")
    .email("Please enter a valid email address")
    .max(254, "Email address cannot exceed 254 characters")
    .toLowerCase()
    .refine((email) => {
      // Additional email validation for common issues
      const parts = email.split('@');
      if (parts.length !== 2) return false;
      const [local, domain] = parts;
      // Local part validation
      if (local.length > 64) return false;
      if (local.startsWith('.') || local.endsWith('.')) return false;
      if (local.includes('..')) return false;
      // Domain validation
      if (domain.length > 253) return false;
      if (domain.startsWith('-') || domain.endsWith('-')) return false;
      return true;
    }, "Please enter a valid email address"),
  role: z.enum(["user", "technical_admin", "verifier_admin"], {
    message: "Please select a valid role",
  }),
});

export type AddUserForm = z.infer<typeof addUserSchema>;

export type Role = "user" | "technical_admin" | "verifier_admin";

export const roleDisplayLabels: Record<Role, string> = {
  user: "User",
  technical_admin: "Technical Admin",
  verifier_admin: "Verifier Admin",
};

export const getRoleDisplayLabel = (role: Role): string => {
  return roleDisplayLabels[role] || role;
};

export const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
});

export type UpdateUserForm = z.infer<typeof updateUserSchema>;
