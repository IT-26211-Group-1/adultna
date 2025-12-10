"use client";

import { Template, TemplateId } from "@/constants/templates";
import { TemplateCard } from "./TemplateCard";

type TemplateGridProps = {
  templates: Template[];
  selectedTemplateId: TemplateId | undefined;
  onSelectTemplate: (templateId: TemplateId) => void;
};

export function TemplateGrid({
  templates,
  selectedTemplateId,
  onSelectTemplate,
}: TemplateGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {templates.map((template) => (
        <TemplateCard
          key={template.id}
          isSelected={selectedTemplateId === template.id}
          template={template}
          onSelect={() => onSelectTemplate(template.id)}
        />
      ))}
    </div>
  );
}
