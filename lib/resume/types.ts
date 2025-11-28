import { ResumeData } from "@/validators/resumeSchema";

export interface EditorFormProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
  onValidationChange?: (isValid: boolean) => void;
}
