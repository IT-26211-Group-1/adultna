import { z } from "zod";

export const fileBoxSchema = z.object({});

export type FileBox = z.infer<typeof fileBoxSchema>;

// Upload Document Schema
export const uploadDocumentSchema = z.object({
  file: z
    .instanceof(File)
    .refine(
      (file) => file.size <= 10 * 1024 * 1024, // 10MB
      "File size must be less than 10MB",
    )
    .refine((file) => {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "image/jpeg",
        "image/png",
      ];

      return allowedTypes.includes(file.type);
    }, "File type must be PDF, DOC, DOCX, JPG, or PNG"),
  category: z.enum([
    "Government Documents",
    "Education",
    "Career",
    "Medical",
    "Personal",
  ]),
  isSecure: z.boolean(),
});

export type UploadDocumentForm = z.infer<typeof uploadDocumentSchema>;

// Secure Document Access Schema
export const secureDocumentAccessOtpSchema = z.object({
  otp: z
    .string()
    .length(6, "OTP must be 6 digits")
    .regex(/^\d+$/, "OTP must be numeric"),
});
