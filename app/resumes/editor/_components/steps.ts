// import { EditorFormProps } from "@/lib/types";
// import EducationForm from "./forms/EducationForm";
import CertificationForm from "./forms/CertificationForm";
import ContactForm from "./forms/ContactForm";
import EducationForm from "./forms/EducationForm";
import SkillsForm from "./forms/SkillsForm";
import SummaryForm from "./forms/SummaryForm";
// import PersonalInfoForm from "./forms/PersonalInfoForm";
// import SkillsForm from "./forms/SkillsForm";
// import SummaryForm from "./forms/SummaryForm";
import WorkExperienceForm from "./forms/WorkExperienceForm";

export const steps: {
  title: string;
  component: React.ComponentType;
  key: string;
}[] = [
    { title: "Contact Information", component: ContactForm, key: "contact" },
    { title: "Work Experience", component: WorkExperienceForm, key: "work" },
    { title: "Education", component: EducationForm, key: "education" },
    { title: "Certifications", component: CertificationForm, key: "certifications" },
    { title: "Skills", component: SkillsForm, key: "skills" },
    { title: "Summary", component: SummaryForm, key: "summary" },
]   