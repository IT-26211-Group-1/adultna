import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";
import ReverseChronologicalTemplate from "../../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../../templates/_components/HybridTemplate";
import { TemplateId } from "@/constants/templates";
import { ExtractedResumeData } from "@/hooks/queries/useResumeQueries";
import { ResumeData } from "@/validators/resumeSchema";

type ExtractedDataPreviewProps = {
  extractedData: ExtractedResumeData;
  templateId: TemplateId;
  colorHex?: string;
  className?: string;
};

export default function ExtractedDataPreview({
  extractedData,
  templateId,
  colorHex,
  className,
}: ExtractedDataPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  const convertStringToDate = (dateString?: string): Date | undefined => {
    if (!dateString) return undefined;
    const date = new Date(dateString);

    return isNaN(date.getTime()) ? undefined : date;
  };

  const convertToResumeData = (): ResumeData & { colorHex?: string } => {
    return {
      templateId,
      colorHex,
      firstName: extractedData.firstName || "",
      lastName: extractedData.lastName || "",
      email: extractedData.email || "",
      phone: extractedData.phone || "",
      jobPosition: extractedData.jobPosition,
      city: extractedData.location,
      linkedin: extractedData.linkedIn,
      portfolio: extractedData.portfolio,
      summary: extractedData.summary,
      workExperiences: extractedData.workExperiences.map((work) => ({
        jobTitle: work.jobTitle,
        employer: work.employer,
        startDate: convertStringToDate(work.startDate),
        endDate: convertStringToDate(work.endDate),
        isCurrentlyWorkingHere: work.currentlyWorking,
        description: work.description,
      })),
      educationItems: extractedData.educationItems.map((edu) => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        schoolName: edu.institution,
        schoolLocation: edu.location,
        graduationDate: convertStringToDate(edu.graduationDate),
      })),
      skills: extractedData.skills.map((skill) => ({
        skill: skill,
      })),
      certificates: extractedData.certifications.map((cert) => ({
        certificate: cert.name,
        issuingOrganization: cert.issuingOrganization,
      })),
    };
  };

  const formatDate = (dateValue: any): string => {
    if (!dateValue) return "";

    try {
      if (dateValue && typeof dateValue === "object" && "year" in dateValue) {
        return new Date(
          dateValue.year,
          dateValue.month - 1,
          dateValue.day,
        ).toLocaleDateString("en-US", { year: "numeric" });
      }

      const date = new Date(dateValue);

      if (isNaN(date.getTime())) {
        return "Invalid Date";
      }

      return date.toLocaleDateString("en-US", { year: "numeric" });
    } catch (error) {
      console.error("Error formatting date:", error, dateValue);

      return "Invalid Date";
    }
  };

  const resumeData = convertToResumeData();

  const getTemplateComponent = () => {
    const props = { resumeData, formatDate };

    switch (templateId) {
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
    <div
      ref={containerRef}
      className={cn("aspect-[210/297] h-fit w-full bg-white", className)}
    >
      <Card className="shadow-lg w-full h-full rounded-lg overflow-hidden">
        <CardBody
          className={cn("p-0", !width && "invisible")}
          style={{
            zoom: (1 / 650) * width,
          }}
        >
          {getTemplateComponent()}
        </CardBody>
      </Card>
    </div>
  );
}
