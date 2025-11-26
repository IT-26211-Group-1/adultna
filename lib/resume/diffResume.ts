import { ResumeData } from "@/validators/resumeSchema";

export interface DiffResult {
  hasChanges: boolean;
  changedFields: string[];
}

function deepEqual(obj1: any, obj2: any): boolean {
  if (obj1 === obj2) return true;

  if (
    typeof obj1 !== "object" ||
    typeof obj2 !== "object" ||
    obj1 === null ||
    obj2 === null
  ) {
    return false;
  }

  if (obj1 instanceof Date && obj2 instanceof Date) {
    return obj1.getTime() === obj2.getTime();
  }

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  for (const key of keys1) {
    if (!keys2.includes(key)) return false;
    if (!deepEqual(obj1[key], obj2[key])) return false;
  }

  return true;
}

export function diffResume(
  oldData: ResumeData | null,
  newData: ResumeData | null,
): DiffResult {
  if (!oldData || !newData) {
    return {
      hasChanges: true,
      changedFields: ["all"],
    };
  }

  const changedFields: string[] = [];

  if (oldData.title !== newData.title) changedFields.push("title");
  if (oldData.templateId !== newData.templateId)
    changedFields.push("templateId");
  if (oldData.firstName !== newData.firstName) changedFields.push("firstName");
  if (oldData.lastName !== newData.lastName) changedFields.push("lastName");
  if (oldData.jobPosition !== newData.jobPosition)
    changedFields.push("jobPosition");
  if (oldData.email !== newData.email) changedFields.push("email");
  if (oldData.phone !== newData.phone) changedFields.push("phone");
  if (oldData.city !== newData.city) changedFields.push("city");
  if (oldData.region !== newData.region) changedFields.push("region");
  if (oldData.linkedin !== newData.linkedin) changedFields.push("linkedin");
  if (oldData.portfolio !== newData.portfolio) changedFields.push("portfolio");
  if (oldData.summary !== newData.summary) changedFields.push("summary");
  if (oldData.colorHex !== newData.colorHex) changedFields.push("colorHex");

  if (oldData.birthDate?.toString() !== newData.birthDate?.toString()) {
    changedFields.push("birthDate");
  }

  if (!deepEqual(oldData.workExperiences, newData.workExperiences)) {
    changedFields.push("workExperiences");
  }

  if (!deepEqual(oldData.educationItems, newData.educationItems)) {
    changedFields.push("educationItems");
  }

  if (!deepEqual(oldData.certificates, newData.certificates)) {
    changedFields.push("certificates");
  }

  if (!deepEqual(oldData.skills, newData.skills)) {
    changedFields.push("skills");
  }

  return {
    hasChanges: changedFields.length > 0,
    changedFields,
  };
}

export function hasResumeChanged(
  oldData: ResumeData | null,
  newData: ResumeData | null,
): boolean {
  return diffResume(oldData, newData).hasChanges;
}
