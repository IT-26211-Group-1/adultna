"use client";

import { useSearchParams } from "next/navigation";
import { AIRecommendations } from "../../_components/AIRecommendations";
import { CoverLetterPreview } from "../../_components/CoverLetterPreview";
import { Tone } from "../../_components/Tone";
import { Button, Card, CardBody } from "@heroui/react";
import {
  useCoverLetter,
  useUpdateSection,
} from "@/hooks/queries/useCoverLetterQueries";
import {
  useExportCoverLetter,
  useChangeTone,
} from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";
import type {
  CoverLetterSection,
  CoverLetterStyle,
} from "@/types/cover-letter";
import { GeneratingCoverLetterLoader } from "../../_components/LoadingSkeleton";

export function CoverLetterEditorContainer() {
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("id") || "";

  const { data: coverLetter, isLoading: isCoverLetterLoading } =
    useCoverLetter(coverLetterId);
  const exportCoverLetter = useExportCoverLetter();
  const changeTone = useChangeTone(coverLetterId);
  const updateSection = useUpdateSection(coverLetterId);

  const handleCopyText = async () => {
    if (!coverLetter?.content) return;

    try {
      await navigator.clipboard.writeText(coverLetter.content);
      addToast({
        title: "Copied to clipboard!",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to copy text",
        color: "danger",
      });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await exportCoverLetter.mutateAsync(coverLetterId);
      addToast({
        title: "PDF downloaded successfully!",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to download PDF",
        color: "danger",
      });
    }
  };

  const handleChangeTone = async (newStyle: CoverLetterStyle) => {
    try {
      await changeTone.mutateAsync({
        currentContent: "",
        newStyle,
      });
      addToast({
        title: "Tone changed successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Failed to change tone",
        color: "danger",
      });
      console.error(error);
    }
  };

  const handleSectionUpdate = async (sectionId: string, content: string) => {
    try {
      await updateSection.mutateAsync({
        sectionId,
        content,
      });
      addToast({
        title: "Section updated successfully!",
        color: "success",
      });
    } catch (error) {
      addToast({
        title: "Failed to update section",
        color: "danger",
      });
      console.error(error);
    }
  };

  const sortedSections =
    coverLetter?.sections?.sort(
      (a: CoverLetterSection, b: CoverLetterSection) => a.order - b.order
    ) || [];

  if (isCoverLetterLoading) {
    return (
      <div className="h-dvh bg-gray-50 p-4 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <GeneratingCoverLetterLoader />
        </div>
      </div>
    );
  }

  return (
    <div className="h-dvh bg-gray-50 p-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1800px] mx-auto h-full">
        <div className="flex flex-col gap-3 h-full min-h-0">
          <Card className="flex-shrink-0">
            <CardBody className="p-3">
              <div className="space-y-0.5">
                <h2 className="text-lg font-semibold">Cover Letter Preview</h2>
                <p className="text-xs text-gray-600">
                  AI-generated based on your resume
                </p>
              </div>
            </CardBody>
          </Card>

          <div className="flex-1 flex items-start justify-center bg-white p-4 rounded-lg overflow-y-auto min-h-0">
            <div className="w-full max-w-[500px]">
              <CoverLetterPreview
                sections={sortedSections}
                onSectionUpdate={handleSectionUpdate}
              />
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <Button
              className="flex-1"
              isDisabled={!coverLetter?.content}
              size="sm"
              variant="bordered"
              onPress={handleCopyText}
            >
              Copy Text
            </Button>
            <Button
              className="flex-1"
              isDisabled={!coverLetter?.content}
              size="sm"
              variant="bordered"
              onPress={handleDownloadPDF}
            >
              Download as PDF
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto">
          <AIRecommendations coverLetterId={coverLetterId} />
          <Tone
            currentStyle={coverLetter?.style}
            onChangeTone={handleChangeTone}
          />
        </div>
      </div>
    </div>
  );
}
