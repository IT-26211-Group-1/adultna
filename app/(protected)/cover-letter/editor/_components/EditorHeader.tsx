"use client";

import { Button } from "@heroui/react";
import { Download } from "lucide-react";
import InlineEditableTitle from "./InlineEditableTitle";
import { SaveStatusIndicator } from "./SaveStatusIndicator";
import { BackButton } from "@/components/ui/BackButton";

type EditorHeaderProps = {
  coverLetterId: string;
  title: string;
  isSaving: boolean;
  hasSaved: boolean;
  hasUnsavedChanges: boolean;
  onTitleChange: (newTitle: string) => void;
  onExport: () => void;
  isExporting: boolean;
  onBack: () => void;
};

export default function EditorHeader({
  coverLetterId,
  title,
  isSaving,
  hasSaved,
  hasUnsavedChanges,
  onTitleChange,
  onExport,
  isExporting,
  onBack,
}: EditorHeaderProps) {
  return (
    <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <BackButton label="Cover Letters" onClick={onBack} />
          <InlineEditableTitle
            coverLetterId={coverLetterId}
            currentTitle={title}
            onTitleChange={onTitleChange}
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
            className="bg-adult-green hover:bg-[#0e4634] text-white"
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
  );
}
