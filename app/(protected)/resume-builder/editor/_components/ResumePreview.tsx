import { ResumeData } from "@/validators/resumeSchema";
import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRef, useMemo, memo, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import useDimensions from "@/hooks/useDimensions";
import ReverseChronologicalTemplate from "../../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../../templates/_components/HybridTemplate";
import { TemplateId } from "@/constants/templates";
import { logger } from "@/lib/logger";

type ResumePreviewProps = {
  resumeData: ResumeData & { colorHex?: string };
  className?: string;
};

function ResumePreview({ resumeData, className }: ResumePreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const searchParams = useSearchParams();
  const templateId = (resumeData.templateId ||
    searchParams.get("templateId") ||
    "reverse-chronological") as TemplateId;

  const formatDate = useCallback((dateValue: any): string => {
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
      logger.error("Error formatting date:", error, dateValue);

      return "Invalid Date";
    }
  }, []);

  const zoom = useMemo(() => {
    if (!width) return 1;

    return Math.min(
      (width * 0.85) / 650,
      ((containerRef.current?.clientHeight || 800) * 0.95) / 842,
    );
  }, [width]);

  const templateComponent = useMemo(() => {
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
  }, [templateId, resumeData, formatDate]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "w-full h-full flex items-center justify-center",
        className,
      )}
    >
      <div className="w-full max-w-[85%] h-full max-h-[95%] aspect-[210/297]">
        <Card className="shadow-lg w-full h-full rounded-lg overflow-hidden">
          <CardBody
            className={cn("p-0", !width && "invisible")}
            style={{ zoom }}
          >
            {templateComponent}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

export default memo(ResumePreview);
