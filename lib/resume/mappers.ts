import type { ResumeData } from "@/validators/resumeSchema";
import type {
  CreateResumeInput,
  UpdateResumeInput,
  Resume,
} from "@/types/resume";
import type { TemplateId } from "@/constants/templates";

type OrderedItem<T> = T & { order: number };

function addOrderToArray<T>(items?: T[]): OrderedItem<T>[] | undefined {
  if (!items || items.length === 0) return undefined;
  return items.map((item, index) => ({ ...item, order: index }));
}

export function mapResumeDataToCreatePayload(
  data: ResumeData,
  templateId: string
): CreateResumeInput {
  return {
    title: data.id ? `${data.firstName || "My"} ${data.lastName || "Resume"}` : "Untitled Resume",
    templateId: templateId as TemplateId,
    status: "draft" as const,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    email: data.email || "",
    phone: data.phone || "",
    city: data.city,
    region: data.region,
    birthDate: data.birthDate,
    linkedin: data.linkedin,
    portfolio: data.portfolio,
    workExperiences: addOrderToArray(data.workExperiences),
    educationItems: addOrderToArray(data.educationItems),
    certificates: addOrderToArray(data.certificates),
    skills: data.skills?.map((skill, index) => ({
      skill,
      order: index,
    })),
    summary: data.summary,
    colorHex: data.colorHex,
  };
}

export function mapResumeDataToUpdatePayload(
  data: ResumeData
): UpdateResumeInput {
  const payload: UpdateResumeInput = {};

  if (data.firstName !== undefined) payload.firstName = data.firstName;
  if (data.lastName !== undefined) payload.lastName = data.lastName;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.city !== undefined) payload.city = data.city;
  if (data.region !== undefined) payload.region = data.region;
  if (data.birthDate !== undefined) payload.birthDate = data.birthDate;
  if (data.linkedin !== undefined) payload.linkedin = data.linkedin;
  if (data.portfolio !== undefined) payload.portfolio = data.portfolio;
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.colorHex !== undefined) payload.colorHex = data.colorHex;

  if (data.workExperiences !== undefined) {
    payload.workExperiences = addOrderToArray(data.workExperiences);
  }

  if (data.educationItems !== undefined) {
    payload.educationItems = addOrderToArray(data.educationItems);
  }

  if (data.certificates !== undefined) {
    payload.certificates = addOrderToArray(data.certificates);
  }

  if (data.skills !== undefined) {
    payload.skills = data.skills.map((skill, index) => ({
      skill,
      order: index,
    }));
  }

  return payload;
}

export function mapApiResumeToResumeData(resume: Resume): ResumeData {
  return {
    id: resume.id,
    firstName: resume.firstName,
    lastName: resume.lastName,
    email: resume.email,
    phone: resume.phone,
    city: resume.city,
    region: resume.region,
    birthDate: resume.birthDate ? new Date(resume.birthDate) : undefined,
    linkedin: resume.linkedin,
    portfolio: resume.portfolio,
    workExperiences: resume.workExperiences
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id, order, ...rest }) => rest),
    educationItems: resume.educationItems
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id, order, ...rest }) => rest),
    certificates: resume.certificates
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id, order, ...rest }) => rest),
    skills: resume.skills
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map((s) => s.skill),
    summary: resume.summary,
    colorHex: resume.colorHex,
  };
}
