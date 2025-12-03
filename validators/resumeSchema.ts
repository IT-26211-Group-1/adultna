import { z } from "zod";
import { convertCalendarDateToDate } from "@/lib/utils/date";

const calendarDateToDate = z
  .any()
  .transform((val) => convertCalendarDateToDate(val));

export const contactSchema = z.object({
  firstName: z
    .string()
    .min(1, "First name is required")
    .refine((val) => val.trim() === val && val.trim().length > 0, {
      message: "First name cannot have leading or trailing spaces",
    })
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "First name must contain only alphabetical characters",
    }),
  lastName: z
    .string()
    .min(1, "Last name is required")
    .refine((val) => val.trim() === val && val.trim().length > 0, {
      message: "Last name cannot have leading or trailing spaces",
    })
    .refine((val) => /^[A-Za-z\s]+$/.test(val), {
      message: "Last name must contain only alphabetical characters",
    }),
  jobPosition: z
    .string()
    .max(100, "Job position must be less than 100 characters")
    .refine((val) => !val || (val.trim() === val && val.trim().length > 0), {
      message: "Job position cannot have leading or trailing spaces",
    })
    .optional(),
  email: z
    .string()
    .email("Please enter a valid email address")
    .min(1, "Email is required")
    .max(100, "Email must be less than 100 characters")
    .refine((val) => val.trim() === val, {
      message: "Email cannot have leading or trailing spaces",
    }),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits")
    .refine((val) => /^9\d{9}$/.test(val), {
      message: "Phone number must start with 9 (e.g., 9XXXXXXXXX)",
    }),
  city: z
    .string()
    .max(50, "City must be less than 50 characters")
    .refine((val) => !val || (val.trim() === val && val.trim().length > 0), {
      message: "City cannot have leading or trailing spaces",
    })
    .optional(),
  region: z
    .string()
    .max(100, "Region must be less than 100 characters")
    .refine((val) => !val || (val.trim() === val && val.trim().length > 0), {
      message: "Region cannot have leading or trailing spaces",
    })
    .optional(),
  birthDate: calendarDateToDate.optional().refine((date) => {
    if (!date) return true;

    return date <= new Date();
  }, "Birth date cannot be in the future"),
  linkedin: z
    .string()
    .max(255, "LinkedIn URL must be less than 255 characters")
    .optional()
    .refine((val) => !val || (val.trim() === val && val.trim().length > 0), {
      message: "LinkedIn URL cannot have leading or trailing spaces",
    })
    .refine((val) => {
      if (!val || val === "") return true;

      // Allow URLs with or without protocol
      const urlToTest =
        val.startsWith("http://") || val.startsWith("https://")
          ? val
          : `https://${val}`;

      try {
        const url = new URL(urlToTest);

        // Check if it's a LinkedIn domain
        return url.hostname.includes("linkedin.com");
      } catch {
        return false;
      }
    }, "Please enter a valid LinkedIn URL"),
  portfolio: z
    .string()
    .max(255, "Portfolio URL must be less than 255 characters")
    .optional()
    .refine((val) => !val || (val.trim() === val && val.trim().length > 0), {
      message: "Portfolio URL cannot have leading or trailing spaces",
    })
    .refine((val) => {
      if (!val || val === "") return true;
      try {
        new URL(val);

        return true;
      } catch {
        return false;
      }
    }, "Please enter a valid portfolio URL"),
});
export type ContactFormData = z.infer<typeof contactSchema>;

export const workSchema = z.object({
  workExperiences: z
    .array(
      z
        .object({
          jobTitle: z
            .string()
            .max(100, "Job title must be less than 100 characters")
            .optional()
            .refine(
              (val) => !val || /^[A-Za-z\s]+$/.test(val),
              "Job title must contain only alphabetical characters",
            ),
          employer: z
            .string()
            .max(100, "Employer must be less than 100 characters")
            .optional(),
          startDate: calendarDateToDate.optional(),
          endDate: calendarDateToDate.optional(),
          isCurrentlyWorkingHere: z.boolean().optional(),
          description: z
            .string()
            .optional()
            .refine((value) => {
              if (!value) return true;
              const wordCount = value.trim().split(/\s+/).length;

              return wordCount <= 100;
            }, "Summary must be less than 100 words"),
        })
        .refine(
          (data) => {
            if (
              !data.startDate ||
              !data.endDate ||
              data.isCurrentlyWorkingHere
            ) {
              return true;
            }

            return data.endDate >= data.startDate;
          },
          {
            message: "End date cannot be earlier than start date",
            path: ["endDate"],
          },
        ),
    )
    .optional(),
});
export type WorkExperienceData = z.infer<typeof workSchema>;

export const educationSchema = z.object({
  educationItems: z
    .array(
      z.object({
        schoolName: z
          .string()
          .max(100, "School name must be less than 100 characters")
          .optional()
          .refine(
            (val) => !val || /^[A-Za-z\s]+$/.test(val),
            "School name must contain only alphabetical characters",
          ),
        schoolLocation: z
          .string()
          .max(100, "School location must be less than 100 characters")
          .optional()
          .refine(
            (val) => !val || /^[A-Za-z0-9\s,.\-()]+$/.test(val),
            "School location must contain only alphabetical characters and basic punctuation",
          ),
        degree: z
          .string()
          .max(100, "Degree must be less than 100 characters")
          .optional(),
        fieldOfStudy: z
          .string()
          .max(100, "Field of study must be less than 100 characters")
          .optional(),
        graduationDate: calendarDateToDate.optional(),
      }),
    )
    .optional(),
});
export type EducationFormData = z.infer<typeof educationSchema>;

export const certificationSchema = z.object({
  certificates: z
    .array(
      z.object({
        certificate: z
          .string()
          .min(1, "Certificate name is required")
          .max(100, "Certificate name must be less than 100 characters"),
        issuingOrganization: z
          .string()
          .max(100, "Issuing organization must be less than 100 characters")
          .optional(),
      }),
    )
    .optional(),
});
export type CertificationFormData = z.infer<typeof certificationSchema>;

export const skillSchema = z.object({
  skills: z
    .array(
      z.object({
        id: z.string().optional(),
        skill: z.string().max(50, "Skill must be less than 50 characters"),
        proficiency: z
          .number()
          .min(0, "Proficiency must be at least 0")
          .max(5, "Proficiency must be at most 5")
          .optional(),
        order: z.number().optional(),
      }),
    )
    .max(15, "You can add up to 15 skills maximum")
    .optional(),
});
export type SkillFormData = z.infer<typeof skillSchema>;

export const summarySchema = z.object({
  summary: z
    .string()
    .max(1500, "Summary must be less than 1500 characters")
    .optional()
    .refine((value) => {
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
  id?: string;
  title?: string;
  templateId?: string;
  colorHex?: string;
};
