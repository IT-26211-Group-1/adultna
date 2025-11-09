import { ResumeData } from "@/validators/resumeSchema";

export const SAMPLE_RESUME_DATA: ResumeData & { colorHex?: string } = {
  firstName: "Tricia",
  lastName: "Arellano",
  email: "tricia.arellano@email.com",
  phone: "(555) 123-4567",
  city: "New York",
  region: "NY",
  linkedin: "linkedin.com/in/triciaarellano",
  portfolio: "tricia.com",
  summary:
    "Experienced professional with a proven track record of delivering high-quality results in fast-paced environments. Skilled in leadership, problem-solving, and strategic planning.",
  workExperiences: [
    {
      jobTitle: "Senior Manager",
      employer: "Tech Company Inc.",
      startDate: new Date(2020, 0, 1),
      endDate: new Date(2024, 0, 1),
      description:
        "Led team of 10 developers\nImplemented agile methodologies\nIncreased productivity by 40%",
    },
    {
      jobTitle: "Project Manager",
      employer: "Startup Solutions",
      startDate: new Date(2018, 0, 1),
      endDate: new Date(2020, 0, 1),
      description:
        "Managed multiple projects simultaneously\nCoordinated cross-functional teams",
    },
  ],
  educationItems: [
    {
      degree: "Master of Business Administration",
      fieldOfStudy: "Business Management",
      schoolName: "University of California",
      schoolLocation: "Los Angeles, CA",
      graduationDate: new Date(2018, 5, 1),
    },
  ],
  skills: [
    "Leadership",
    "Project Management",
    "Strategic Planning",
    "Communication",
    "Data Analysis",
    "Problem Solving",
  ],
  certificates: [
    {
      certificate: "PMP Certification",
      issuingOrganization: "PMI",
    },
  ],
};
