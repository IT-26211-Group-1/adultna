"use client";

import { useState } from "react";
import Link from "next/link";
import { TEMPLATE_LIST, TemplateId } from "@/constants/templates";
import { Button } from "@heroui/react";
import { TemplateGrid } from "./TemplateGrid";
import { TemplateSelectorHeader } from "./TemplateSelectorHeader";
import { ArrowLeft } from "lucide-react";

interface TemplateSelectorProps {
  onSelect: (templateId: TemplateId) => void;
  selectedTemplateId?: TemplateId;
}

export function TemplateSelector({
  onSelect,
  selectedTemplateId,
}: TemplateSelectorProps) {
  const [selected, setSelected] = useState<TemplateId | undefined>(
    selectedTemplateId
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
    <div className="w-full max-w-7xl mx-auto space-y-8 p-6">
      {/* Back Button */}
      <Link
        href="/resume-builder"
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="font-medium">Back</span>
      </Link>

      {/* Header */}
      <TemplateSelectorHeader />

      {/* Template Grid */}
      <TemplateGrid
        templates={TEMPLATE_LIST}
        selectedTemplateId={selected}
        onSelectTemplate={handleSelect}
      />

      {/* Continue Button */}
      {selected && (
        <div className="flex justify-center pt-4">
          <Button
            size="lg"
            color="success"
            className="bg-adult-green text-white px-8"
            onPress={handleContinue}
          >
            Continue with {selectedTemplate?.name}
          </Button>
        </div>
      )}
    </div>
  );
}
