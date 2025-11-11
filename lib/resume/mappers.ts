import type { ResumeData } from "@/validators/resumeSchema";
import type {
  CreateResumeInput,
  UpdateResumeInput,
  Resume,
} from "@/types/resume";
import type { TemplateId } from "@/constants/templates";
import { convertCalendarDateToISO } from "@/lib/utils/date";

type OrderedItem<T> = T & { order: number };

function addOrderToArray<T>(items?: T[]): OrderedItem<T>[] | undefined {
  if (!items || items.length === 0) return undefined;

  return items.map((item, index) => ({ ...item, order: index }));
}

export function mapResumeDataToCreatePayload(
  data: ResumeData,
  templateId: string,
): CreateResumeInput {
  return {
    title: data.id
      ? `${data.firstName || "My"} ${data.lastName || "Resume"}`
      : "Untitled Resume",
    templateId: templateId as TemplateId,
    status: "draft" as const,
    firstName: data.firstName || "",
    lastName: data.lastName || "",
    jobPosition: data.jobPosition,
    email: data.email || "",
    phone: data.phone || "",
    city: data.city,
    region: data.region,
    birthDate: convertCalendarDateToISO(
      data.birthDate as Date | undefined,
    ) as any,
    linkedin: data.linkedin,
    portfolio: data.portfolio,
    workExperiences: data.workExperiences?.map((exp, index) => ({
      ...exp,
      startDate: convertCalendarDateToISO(
        exp.startDate as Date | undefined,
      ) as any,
      endDate: convertCalendarDateToISO(exp.endDate as Date | undefined) as any,
      order: index,
    })),
    educationItems: data.educationItems?.map((edu, index) => ({
      ...edu,
      graduationDate: convertCalendarDateToISO(
        edu.graduationDate as Date | undefined,
      ) as any,
      order: index,
    })),
    certificates: addOrderToArray(data.certificates),
    skills: data.skills?.map((skillItem, index) => ({
      skill: skillItem.skill,
      proficiency: skillItem.proficiency,
      order: index,
    })),
    summary: data.summary,
    colorHex: data.colorHex,
  };
}

export function mapResumeDataToUpdatePayload(
  data: ResumeData & { status?: "draft" | "completed" },
): UpdateResumeInput {
  const payload: UpdateResumeInput = {};

  if (data.title !== undefined) payload.title = data.title;
  if (data.status !== undefined) payload.status = data.status;
  if (data.firstName !== undefined) payload.firstName = data.firstName;
  if (data.lastName !== undefined) payload.lastName = data.lastName;
  if (data.jobPosition !== undefined) payload.jobPosition = data.jobPosition;
  if (data.email !== undefined) payload.email = data.email;
  if (data.phone !== undefined) payload.phone = data.phone;
  if (data.city !== undefined) payload.city = data.city;
  if (data.region !== undefined) payload.region = data.region;
  if (data.birthDate !== undefined) {
    payload.birthDate = convertCalendarDateToISO(
      data.birthDate as Date | undefined,
    ) as any;
  }
  if (data.linkedin !== undefined) payload.linkedin = data.linkedin;
  if (data.portfolio !== undefined) payload.portfolio = data.portfolio;
  if (data.summary !== undefined) payload.summary = data.summary;
  if (data.colorHex !== undefined) payload.colorHex = data.colorHex;

  if (data.workExperiences !== undefined) {
    payload.workExperiences = data.workExperiences.map((exp, index) => ({
      ...exp,
      startDate: convertCalendarDateToISO(
        exp.startDate as Date | undefined,
      ) as any,
      endDate: convertCalendarDateToISO(exp.endDate as Date | undefined) as any,
      order: index,
    }));
  }

  if (data.educationItems !== undefined) {
    payload.educationItems = data.educationItems.map((edu, index) => ({
      ...edu,
      graduationDate: convertCalendarDateToISO(
        edu.graduationDate as Date | undefined,
      ) as any,
      order: index,
    }));
  }

  if (data.certificates !== undefined) {
    payload.certificates = addOrderToArray(data.certificates);
  }

  if (data.skills !== undefined) {
    payload.skills = data.skills.map((skillItem, index) => ({
      skill: skillItem.skill,
      proficiency: skillItem.proficiency,
      order: index,
    }));
  }

  return payload;
}

export function mapApiResumeToResumeData(resume: Resume): ResumeData {
  return {
    id: resume.id,
    title: resume.title,
    templateId: resume.templateId,
    firstName: resume.firstName,
    lastName: resume.lastName,
    jobPosition: resume.jobPosition,
    email: resume.email,
    phone: resume.phone,
    city: resume.city,
    region: resume.region,
    birthDate: resume.birthDate ? new Date(resume.birthDate) : undefined,
    linkedin: resume.linkedin,
    portfolio: resume.portfolio,
    workExperiences: resume.workExperiences
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id: _id, order: _order, startDate, endDate, ...rest }) => ({
        ...rest,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
      })),
    educationItems: resume.educationItems
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id: _id, order: _order, graduationDate, ...rest }) => ({
        ...rest,
        graduationDate: graduationDate ? new Date(graduationDate) : undefined,
      })),
    certificates: resume.certificates
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id: _id, order: _order, ...rest }) => rest),
    skills: resume.skills
      ?.sort((a, b) => (a.order || 0) - (b.order || 0))
      .map(({ id: _id, order: _order, ...rest }) => rest),
    summary: resume.summary,
    colorHex: resume.colorHex,
  };
}
