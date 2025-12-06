"use client";

import { Template } from "@/constants/templates";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import ReverseChronologicalTemplate from "../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../templates/_components/HybridTemplate";
import { SAMPLE_RESUME_DATA } from "@/constants/template-date";

type TemplateCardProps = {
  template: Template;
  isSelected: boolean;
  onSelect: () => void;
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
    } catch {
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
      disableAnimation
      isPressable
      className={cn(
        "cursor-pointer transition-all duration-300 ease-in-out border-2 hover:border-adult-green hover:bg-gray-50/50",
        isSelected ? "border-adult-green bg-adult-green/5" : "border-gray-200"
      )}
      shadow="none"
      onPress={() => {
        onSelect();
      }}
    >
      <CardBody className="p-3 space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-1">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              {template.name}
            </h3>
            <p className="text-xs text-gray-600">{template.description}</p>
          </div>
          {isSelected && (
            <div className="h-5 w-5 rounded-full bg-adult-green flex items-center justify-center flex-shrink-0">
              <Check className="h-3 w-3 text-white" />
            </div>
          )}
        </div>

        {/* Template Preview */}
        <div className="aspect-[8.5/11] bg-white rounded-md overflow-hidden relative border-2 border-gray-100 transition-all duration-300 pointer-events-none">
          <div
            className="w-full h-full pointer-events-none"
            style={{
              transform: "scale(0.5)",
              transformOrigin: "top left",
              width: "200%",
              height: "200%",
            }}
          >
            {getTemplateComponent()}
          </div>
        </div>
      </CardBody>

      <CardFooter className="p-3 pt-0">
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <div
              className="h-3 w-3 rounded-full border border-gray-300"
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
