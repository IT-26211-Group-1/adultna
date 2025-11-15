"use client";

import { Card, CardBody, Button } from "@heroui/react";
import { Copy, Download, Save } from "lucide-react";
import { CoverLetterPreview } from "../../_components/CoverLetterPreview";
import {
  useExportCoverLetter,
  useSaveToFilebox,
} from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";
import type { CoverLetterSection } from "@/types/cover-letter";

type PreviewSectionProps = {
  coverLetterId: string;
  sections: CoverLetterSection[];
};

export default function PreviewSection({ coverLetterId, sections }: PreviewSectionProps) {
  const exportCoverLetter = useExportCoverLetter();
  const saveToFilebox = useSaveToFilebox(coverLetterId);

  const handleCopyText = async () => {
    const fullText = sections.map((section) => section.content).join("\n\n");

    try {
      await navigator.clipboard.writeText(fullText);
      addToast({ title: "Copied to clipboard!", color: "success" });
    } catch {
      addToast({ title: "Failed to copy", color: "danger" });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await exportCoverLetter.mutateAsync(coverLetterId);
      addToast({ title: "PDF downloaded successfully!", color: "success" });
    } catch {
      addToast({ title: "Failed to download PDF", color: "danger" });
    }
  };

  const handleSaveToFilebox = async () => {
    try {
      await saveToFilebox.mutateAsync();
      addToast({
        title: "Saved to Filebox!",
        description: "Your cover letter has been saved",
        color: "success",
      });
    } catch {
      addToast({ title: "Failed to save to Filebox", color: "danger" });
    }
  };

  return (
    <Card>
      <CardBody className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Cover Letter Preview</h2>
          <div className="flex gap-2">
            <Button
              size="sm"
              startContent={<Copy size={16} />}
              variant="flat"
              onPress={handleCopyText}
            >
              Copy Text
            </Button>
            <Button
              color="success"
              isLoading={saveToFilebox.isPending}
              size="sm"
              startContent={<Save size={16} />}
              variant="flat"
              onPress={handleSaveToFilebox}
            >
              Save to Filebox
            </Button>
            <Button
              className="bg-adult-green hover:bg-[#0e4634] text-white"
              isLoading={exportCoverLetter.isPending}
              size="sm"
              startContent={<Download size={16} />}
              onPress={handleDownloadPDF}
            >
              Download as PDF
            </Button>
          </div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <CoverLetterPreview sections={sections} />
        </div>
      </CardBody>
    </Card>
  );
}
