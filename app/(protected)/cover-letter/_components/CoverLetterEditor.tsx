"use client";

import { AIRecommendations } from "./AIRecommendations";
import { CoverLetterPreview } from "./CoverLetterPreview";
import { Tone } from "./Tone";
import { Button, Card, CardBody } from "@heroui/react";
import { CoverLetterLanding } from "./CoverLetterLanding";
import { useCoverLetterEditor } from "@/hooks/useCoverLetterEditor";
import { useCoverLetter } from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";

export default function CoverLetterEditor() {
  const {
    uploadedFile,
    currentCoverLetterId,
    isProcessing,
    selectedStyle,
    setSelectedStyle,
    handleFileUpload,
    handleGenerateCoverLetter,
    handleRemoveFile,
    handleDownloadPDF,
    handleChangeTone,
  } = useCoverLetterEditor();

  const { data: coverLetter } = useCoverLetter(currentCoverLetterId || "");

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

  // Show landing page (handles upload, file state, and processing)
  if (!currentCoverLetterId) {
    return (
      <CoverLetterLanding
        isProcessing={isProcessing}
        uploadedFile={uploadedFile}
        selectedStyle={selectedStyle}
        onFileUpload={handleFileUpload}
        onGenerateCoverLetter={handleGenerateCoverLetter}
        onRemoveFile={handleRemoveFile}
        onStyleChange={setSelectedStyle}
      />
    );
  }

  const contentSections =
    coverLetter?.sections
      ?.sort((a, b) => a.order - b.order)
      .map((s) => s.content) || [];

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
              <CoverLetterPreview content={contentSections} />
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
          <AIRecommendations coverLetterId={currentCoverLetterId} />
          <Tone
            currentStyle={coverLetter?.style}
            onChangeTone={handleChangeTone}
          />
        </div>
      </div>
    </div>
  );
}
