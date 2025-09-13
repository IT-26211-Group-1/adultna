import { z } from "zod";

export const addUserSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.email("Please enter a valid email address"),
  role: z.enum(["user", "technical_admin", "verifier_admin"]),
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
