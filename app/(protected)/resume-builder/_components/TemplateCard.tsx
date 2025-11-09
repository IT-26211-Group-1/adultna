"use client";

import { Template } from "@/constants/templates";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReverseChronologicalTemplate from "../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../templates/_components/HybridTemplate";
import { ResumeData } from "@/validators/resumeSchema";

type TemplateCardProps = {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
};

const SAMPLE_RESUME_DATA: ResumeData & { colorHex?: string } = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@email.com",
  phone: "(555) 123-4567",
  city: "New York",
  region: "NY",
  linkedin: "linkedin.com/in/johndoe",
  portfolio: "johndoe.com",
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

export function TemplateCard({
  template,
  isSelected,
  onSelect,
}: TemplateCardProps) {
  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "";
    try {
      if (dateValue && typeof dateValue === "object" && "year" in dateValue) {
        return new Date(
          dateValue.year,
          dateValue.month - 1,
          dateValue.day
        ).toLocaleDateString("en-US", { year: "numeric" });
      }
      const date = new Date(dateValue);
      if (isNaN(date.getTime())) return "Invalid Date";
      return date.toLocaleDateString("en-US", { year: "numeric" });
    } catch (error) {
      return "Invalid Date";
    }
  };

  const resumeDataWithColor = {
    ...SAMPLE_RESUME_DATA,
    colorHex: template.colorScheme,
  };

  const getTemplateComponent = () => {
    const props = { resumeData: resumeDataWithColor, formatDate };
    switch (template.id) {
      case "reverse-chronological":
        return <ReverseChronologicalTemplate {...props} />;
      case "modern":
        return <ModernTemplate {...props} />;
      case "skill-based":
        return <SkillBasedTemplate {...props} />;
      case "hybrid":
        return <HybridTemplate {...props} />;
      default:
        return <ReverseChronologicalTemplate {...props} />;
    }
  };

  return (
    <Card
      isPressable
      isHoverable
      className={cn(
        "cursor-pointer transition-all border",
        isSelected && "ring-2 ring-adult-green shadow-lg border-adult-green"
      )}
      onPress={onSelect}
    >
      <CardBody className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">
              {template.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">{template.description}</p>
          </div>
          {isSelected && (
            <div className="h-6 w-6 rounded-full bg-adult-green flex items-center justify-center flex-shrink-0">
              <Check className="h-4 w-4 text-white" />
            </div>
          )}
        </div>

        {/* Template Preview */}
        <div className="aspect-[8.5/11] bg-white rounded-lg overflow-hidden relative border border-gray-200">
          <div
            className="w-full h-full"
            style={{
              transform: "scale(0.25)",
              transformOrigin: "top left",
              width: "400%",
              height: "400%",
            }}
          >
            {getTemplateComponent()}
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className="h-4 w-4 rounded-full border border-gray-300"
              style={{ backgroundColor: template.colorScheme }}
            />
            <span className="text-gray-600 text-xs capitalize">
              {template.layoutType.replace("-", " ")}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {template.fontFamily.split(",")[0]}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
