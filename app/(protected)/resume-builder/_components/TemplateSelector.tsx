"use client";

import { useState } from "react";
import { TEMPLATE_LIST, TemplateId } from "@/constants/templates";
import { Button } from "@heroui/react";
import { TemplateGrid } from "./TemplateGrid";
import { TemplateSelectorHeader } from "./TemplateSelectorHeader";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import NextLink from "next/link";

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

        {/* Terms and Conditions */}
        <div className="text-center">
          <p className="text-sm text-gray-500">
            By clicking any of the above options, you agree to our{" "}
            <NextLink
              className="text-green-700 hover:text-green-800 underline"
              href="/terms"
            >
              Terms and Conditions
            </NextLink>{" "}
            and{" "}
            <NextLink
              className="text-green-700 hover:text-green-800 underline"
              href="/privacy"
            >
              Privacy Policy
            </NextLink>
            .
          </p>
        </div>

        {/* Continue Button - Sticky on mobile, normal on desktop */}
        <div className="pt-8">
          {/* Desktop Button */}
          <div className="hidden sm:flex justify-center">
            <Button
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-12 py-3 shadow-lg"
              size="lg"
              radius="md"
              isDisabled={!selected}
              onPress={handleContinue}
            >
              {selected ? `Continue with ${selectedTemplate?.name}` : "Select a template to continue"}
            </Button>
          </div>

          {/* Mobile Sticky Button */}
          <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50">
            <Button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 shadow-xl"
              size="lg"
              radius="md"
              isDisabled={!selected}
              onPress={handleContinue}
            >
              {selected ? `Continue with ${selectedTemplate?.name}` : "Select a template"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
