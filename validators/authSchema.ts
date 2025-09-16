import { z } from "zod";

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "First name is required")
      .refine(
        (val) => val === val.trim(),
        "First name cannot start or end with spaces"
      )
      .refine(
        (val) => val.trim().length >= 2,
        "First name must be at least 2 characters"
      )
      .refine(
        (val) => !/\s{2,}/.test(val),
        "First name cannot contain multiple consecutive spaces"
      )
      .max(30, "First name must be less than 30 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "First name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    lastName: z
      .string()
      .min(1, "Last name is required")
      .refine(
        (val) => val === val.trim(),
        "Last name cannot start or end with spaces"
      )
      .refine(
        (val) => val.trim().length >= 2,
        "Last name must be at least 2 characters"
      )
      .refine(
        (val) => !/\s{2,}/.test(val),
        "Last name cannot contain multiple consecutive spaces"
      )
      .max(30, "Last name must be less than 30 characters")
      .regex(
        /^[a-zA-Z\s'-]+$/,
        "Last name can only contain letters, spaces, hyphens, and apostrophes"
      ),
    email: z
      .email({ message: "Please enter a valid email address" })
      .min(1, "Email is required")
      .refine(
        (val) => val === val.trim(),
        "Email cannot start or end with spaces"
      )
      .refine((val) => !/\s/.test(val), "Email cannot contain any spaces")
      .max(100, "Email must be less than 100 characters")
      .refine(
        (val) => !val.includes(".."),
        "Email cannot contain consecutive dots"
      )
      .refine(
        (val) => !val.startsWith(".") && !val.endsWith("."),
        "Email cannot start or end with a dot"
      ),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(50, "Password must be less than 50 characters")
      .regex(
        /^(?=.*[a-z])/,
        "Password must contain at least one lowercase letter"
      )
      .regex(
        /^(?=.*[A-Z])/,
        "Password must contain at least one uppercase letter"
      )
      .regex(/^(?=.*\d)/, "Password must contain at least one number")
      .regex(
        /^(?=.*[!@#$%^&*(),.?":{}|<>])/,
        "Password must contain at least one special character"
      )
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces")
      .refine(
        (val) => !/(.)\1{2,}/.test(val),
        "Password cannot have more than 2 consecutive identical characters"
      ),
    confirmPassword: z
      .string()
      .min(1, "Please confirm your password")
      .refine((val) => !/\s/.test(val), "Password cannot contain spaces"),
    acceptedTerms: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const verifyEmailSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
  verificationToken: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.email("Invalid Email Format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const forgotPasswordOtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export const forgotPasswordSchema = z.object({
  email: z.email("Email is Required"),
});

export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    verificationToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });
