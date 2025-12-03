import { ResumeData } from "@/validators/resumeSchema";

export const SAMPLE_RESUME_DATA: ResumeData & { colorHex?: string } = {
  firstName: "Lorem",
  lastName: "Ipsum",
  email: "lorem.ipsum@email.com",
  phone: "(555) 000-0000",
  city: "Lorem City",
  region: "LI",
  linkedin: "linkedin.com/in/loremipsum",
  portfolio: "loremipsum.com",
  summary:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  workExperiences: [
    {
      jobTitle: "Lorem Ipsum Manager",
      employer: "Dolor Sit Amet Inc.",
      startDate: new Date(2020, 0, 1),
      endDate: new Date(2024, 0, 1),
      description:
        "Lorem ipsum dolor sit amet\nConsectetur adipiscing elit sed do eiusmod\nTempor incididunt ut labore et dolore",
    },
    {
      jobTitle: "Consectetur Specialist",
      employer: "Adipiscing Solutions",
      startDate: new Date(2018, 0, 1),
      endDate: new Date(2020, 0, 1),
      description:
        "Sed do eiusmod tempor incididunt ut labore\nDolore magna aliqua ut enim ad minim",
    },
  ],
  educationItems: [
    {
      degree: "Lorem Ipsum Degree",
      fieldOfStudy: "Dolor Sit Amet",
      schoolName: "Consectetur University",
      schoolLocation: "Adipiscing, LA",
      graduationDate: new Date(2018, 5, 1),
    },
  ],
  skills: [
    { skill: "Lorem Ipsum", proficiency: 5 },
    { skill: "Dolor Sit Amet", proficiency: 5 },
    { skill: "Consectetur", proficiency: 4 },
    { skill: "Adipiscing", proficiency: 4 },
    { skill: "Eiusmod Tempor", proficiency: 4 },
    { skill: "Incididunt", proficiency: 5 },
  ],
  certificates: [
    {
      certificate: "Lorem Ipsum Certification",
      issuingOrganization: "Dolor Sit",
    },
  ],
};
