"use client";

import { Button } from "@heroui/react";
import { Download } from "lucide-react";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type EditorHeaderProps = {
  title: string;
  isSaving: boolean;
  hasSaved: boolean;
  hasUnsavedChanges: boolean;
  onExport: () => void;
  isExporting: boolean;
};

export default function EditorHeader({
  title,
  isSaving,
  hasSaved,
  hasUnsavedChanges,
  onExport,
  isExporting,
}: EditorHeaderProps) {
  return (
    <div className="bg-transparent w-full flex-shrink-0">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Cover Letter", href: "/cover-letter" },
                  { label: title || "Untitled Cover Letter", current: true },
                ]}
              />
              <SaveStatusIndicator
                hasSaved={hasSaved}
                hasUnsavedChanges={hasUnsavedChanges}
                isSaving={isSaving}
              />
            </div>

            <div className="flex items-center gap-3">
              <Button
                disableAnimation
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 shadow-lg"
                isLoading={isExporting}
                size="sm"
                startContent={isExporting ? null : <Download size={16} />}
                onPress={onExport}
              >
                {isExporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
