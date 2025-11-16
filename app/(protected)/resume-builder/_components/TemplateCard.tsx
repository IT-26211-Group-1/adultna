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
          dateValue.day,
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
      isHoverable
      isPressable
      className={cn(
        "cursor-pointer transition-all border",
        isSelected && "ring-2 ring-adult-green shadow-lg border-adult-green",
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
              transform: "scale(0.6)",
              transformOrigin: "top left",
              width: "166.67%",
              height: "166.67%",
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
