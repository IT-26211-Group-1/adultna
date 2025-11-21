"use client";

import { useRouter } from "next/navigation";
import { TemplateSelector } from "../../_components/TemplateSelector";
import { TemplateId } from "@/constants/templates";

export function TemplatesPageContent() {
  const router = useRouter();

  const handleTemplateSelect = (templateId: TemplateId) => {
    router.push(`/resume-builder/editor?templateId=${templateId}`);
  };

  return <TemplateSelector onSelect={handleTemplateSelect} />;
}
