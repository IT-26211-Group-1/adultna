import { ResumeData } from "@/validators/resumeSchema";

export interface EditorFormProps {
  resumeData: ResumeData;
  setResumeData: (
    data: ResumeData | ((prevData: ResumeData) => ResumeData),
  ) => void;
  onValidationChange?: (isValid: boolean) => void;
}
