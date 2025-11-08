"use client";

import { Template } from "@/constants/templates";
import { Card, CardBody, CardFooter } from "@heroui/react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
        <div className="aspect-[8.5/11] bg-gray-50 rounded-lg overflow-hidden relative border border-gray-200">
          <div
            className="w-full h-full p-4 text-[0.5rem] leading-tight"
            style={{
              fontFamily: template.fontFamily,
            }}
          >
            {/* Header simulation */}
            <div className="text-center border-b border-gray-300 pb-2 mb-2">
              <h1
                className="font-bold text-sm mb-1"
                style={{ color: template.colorScheme }}
              >
                {template.layoutType === "two-column"
                  ? "First Name Last Name"
                  : "SIMPLE RESUME FORMAT"}
              </h1>
              <div className="text-[0.4rem] text-gray-600 space-y-0.5">
                <p>Email Address | Phone Number</p>
                <p>City, State | LinkedIn | Portfolio</p>
              </div>
            </div>

            {/* Content simulation based on layout */}
            {template.layoutType === "single-column" ? (
              <div className="space-y-2">
                <div>
                  <h2
                    className="font-semibold text-[0.5rem] border-b mb-1"
                    style={{ borderColor: template.colorScheme }}
                  >
                    PROFESSIONAL EXPERIENCE
                  </h2>
                  <div className="space-y-1">
                    <div className="text-[0.35rem]">
                      <p className="font-semibold">Job Title</p>
                      <p className="text-gray-600">Company Name</p>
                      <div className="mt-0.5">• Achievement line</div>
                    </div>
                  </div>
                </div>
                <div>
                  <h2
                    className="font-semibold text-[0.5rem] border-b mb-1"
                    style={{ borderColor: template.colorScheme }}
                  >
                    EDUCATION
                  </h2>
                  <div className="text-[0.35rem]">
                    <p className="font-semibold">Degree Name</p>
                    <p className="text-gray-600">University Name</p>
                  </div>
                </div>
              </div>
            ) : template.layoutType === "two-column" ? (
              <div className="grid grid-cols-3 gap-2">
                <div className="col-span-2 space-y-2">
                  <div>
                    <h2
                      className="font-semibold text-[0.5rem] mb-1"
                      style={{ color: template.colorScheme }}
                    >
                      PROFESSIONAL EXPERIENCE
                    </h2>
                    <div className="text-[0.35rem] space-y-1">
                      <div>
                        <p className="font-semibold">Senior Position Title</p>
                        <p className="text-gray-600">Company Name</p>
                        <div className="mt-0.5">• Key achievement</div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h2
                      className="font-semibold text-[0.5rem] mb-1"
                      style={{ color: template.colorScheme }}
                    >
                      EDUCATION
                    </h2>
                    <div className="text-[0.35rem]">
                      <p className="font-semibold">Degree</p>
                      <p className="text-gray-600">University</p>
                    </div>
                  </div>
                </div>
                <div
                  className="space-y-2 border-l pl-2"
                  style={{ borderColor: template.colorScheme + "40" }}
                >
                  <div>
                    <h2
                      className="font-semibold text-[0.5rem] mb-1"
                      style={{ color: template.colorScheme }}
                    >
                      SKILLS
                    </h2>
                    <div className="text-[0.35rem] space-y-0.5">
                      <p>• Skill 1</p>
                      <p>• Skill 2</p>
                      <p>• Skill 3</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Asymmetric layout
              <div className="space-y-2">
                <div
                  className="p-2 rounded"
                  style={{ backgroundColor: template.colorScheme + "10" }}
                >
                  <h2
                    className="font-bold text-[0.5rem] mb-1"
                    style={{ color: template.colorScheme }}
                  >
                    EXPERIENCE
                  </h2>
                  <div className="text-[0.35rem]">
                    <p className="font-semibold">Creative Role</p>
                    <p className="text-gray-600">Studio Name</p>
                  </div>
                </div>
                <div className="text-[0.35rem] space-y-1">
                  <div>
                    <h2 className="font-semibold text-[0.45rem]">EDUCATION</h2>
                    <p>Degree Program</p>
                  </div>
                </div>
              </div>
            )}
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
