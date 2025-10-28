import {z} from "zod";
import { de, fi } from "zod/v4/locales";
import { CalendarDate } from "@internationalized/date";

// Helper function to convert CalendarDate to Date
const calendarDateToDate = z.any().transform((val) => {
  if (!val) return undefined;
  if (val instanceof Date) return val;
  if (val instanceof CalendarDate) {
    return new Date(val.year, val.month - 1, val.day);
  }
  return val;
});

export const contactSchema = z.object({
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Please enter a valid email address").min(1, "Email is required").max(100, "Email must be less than 100 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits").max(12, "Phone number must be at most 12 digits"),
    city: z.string().max(50, "City must be less than 50 characters").optional(),
    region: z.string().max(100, "Region must be less than 100 characters").optional(),
    birthDate: calendarDateToDate.optional(),
    linkedin: z.string().max(255, "LinkedIn URL must be less than 255 characters").optional(),
    portfolio: z.string().max(255, "Portfolio URL must be less than 255 characters").optional(),
});
export type ContactFormData = z.infer<typeof contactSchema>;

export const workSchema = z.object({
    workExperiences: z.array(
        z.object({
            jobTitle: z.string().max(100, "Job title must be less than 100 characters").optional(),
            employer: z.string().max(100, "Employer must be less than 100 characters").optional(),
            startDate: calendarDateToDate.optional(),
            endDate: calendarDateToDate.optional(),
            isCurrentlyWorkingHere: z.boolean().optional(),
            description: z.string().optional().refine((value) => {
                if (!value) return true;
                const wordCount = value.trim().split(/\s+/).length;
                return wordCount <= 100;
                }, "Summary must be less than 100 words"),
    })).optional(),
});
export type WorkExperienceData = z.infer<typeof workSchema>;

export const educationSchema = z.object({
    educationItems: z.array(
        z.object({
            schoolName: z.string().max(100, "School name must be less than 100 characters").optional(),
            schoolLocation: z.string().max(100, "School location must be less than 100 characters").optional(),
            degree: z.string().max(100, "Degree must be less than 100 characters").optional(),
            fieldOfStudy: z.string().max(100, "Field of study must be less than 100 characters").optional(),
            graduationDate: calendarDateToDate.optional(),
        })
    ).optional(),
});
export type EducationFormData = z.infer<typeof educationSchema>;

export const certificationSchema = z.object({
    certificates: z.array(
        z.object({
            certificate: z.string().min(1, "Certificate name is required").max(100, "Certificate name must be less than 100 characters"),
            issuingOrganization: z.string().max(100, "Issuing organization must be less than 100 characters").optional(),
        })
    ).optional(),
});
export type CertificationFormData = z.infer<typeof certificationSchema>;

export const skillSchema = z.object({
    skills: z.array(z.string().max(50, "Skill must be less than 50 characters")).optional(),
});
export type SkillFormData = z.infer<typeof skillSchema>;

export const summarySchema = z.object({
  summary: z.string().optional().refine((value) => {
      if (!value) return true;
      const wordCount = value.trim().split(/\s+/).length;
      return wordCount <= 250;
    }, "Summary must be less than 250 words"),
});
export type SummaryFormData = z.infer<typeof summarySchema>;

export const resumeSchema = z.object({
    ...contactSchema.shape,
    ...workSchema.shape,
    ...educationSchema.shape,
    ...certificationSchema.shape,
    ...skillSchema.shape,
    ...summarySchema.shape,
});

export type ResumeData = z.infer<typeof resumeSchema> & {
    id?: string; // Optional ID field for existing resumes
}