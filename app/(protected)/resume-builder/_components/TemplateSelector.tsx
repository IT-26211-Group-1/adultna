"use client";

import { useState } from "react";
import { TEMPLATE_LIST, TemplateId } from "@/constants/templates";
import { Button } from "@heroui/react";
import { TemplateGrid } from "./TemplateGrid";
import { TemplateSelectorHeader } from "./TemplateSelectorHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateId) => void;
  selectedTemplateId?: TemplateId;
}

export function TemplateSelector({
  onSelect,
  selectedTemplateId,
}: TemplateSelectorProps) {
  const [selected, setSelected] = useState<TemplateId | undefined>(
    selectedTemplateId,
  );

  const handleSelect = (templateId: TemplateId) => {
    setSelected(templateId);
  };

  const handleContinue = () => {
    if (selected) {
      onSelect(selected);
    }
  };

  const selectedTemplate = TEMPLATE_LIST.find((t) => t.id === selected);

  return (
    <div className="w-full">
      {/* Breadcrumb Section */}
      <div className="bg-transparent w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Resume Builder", href: "/resume-builder" },
                  { label: "Templates", current: true },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8 pb-16 space-y-8">
        {/* Header */}
        <TemplateSelectorHeader />

        {/* Template Grid */}
        <TemplateGrid
          selectedTemplateId={selected}
          templates={TEMPLATE_LIST}
          onSelectTemplate={handleSelect}
        />

        {/* Continue Button */}
        {selected && (
          <div className="flex justify-center pt-4">
            <Button
              className="bg-adult-green text-white px-8"
              color="success"
              size="lg"
              onPress={handleContinue}
            >
              Continue with {selectedTemplate?.name}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
