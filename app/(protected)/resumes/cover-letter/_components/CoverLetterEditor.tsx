"use client";

import { useState } from "react";
import { AIRecommendations } from "./AIRecommendations";
import { CoverLetterPreview } from "./CoverLetterPreview";
import { Tone } from "./Tone";
import { Button, Card, CardBody } from "@heroui/react";

export default function CoverLetterEditor() {
  const [coverLetterContent, setCoverLetterContent] = useState<string[]>([]);

  const handleApplyRecommendation = (content: string) => {
    setCoverLetterContent((prev) => [...prev, content]);
  };

  const handleCopyText = () => {
    const fullText = coverLetterContent.join("\n\n");

    navigator.clipboard.writeText(fullText);
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
  };

  return (
    <div className="h-dvh bg-gray-50 p-4 overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 max-w-[1800px] mx-auto h-full">
        {/* Left Column - Cover Letter Preview */}
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
              <CoverLetterPreview content={coverLetterContent} />
            </div>
          </div>

          <div className="flex gap-3 flex-shrink-0">
            <Button
              className="flex-1"
              isDisabled={coverLetterContent.length === 0}
              size="sm"
              variant="bordered"
              onClick={handleCopyText}
            >
              Copy Text
            </Button>
            <Button
              className="flex-1"
              isDisabled={coverLetterContent.length === 0}
              size="sm"
              variant="bordered"
              onClick={handleDownloadPDF}
            >
              Download as PDF
            </Button>
          </div>
        </div>

        {/* Right Column - AI Recommendations & Tone */}
        <div className="flex flex-col gap-4 h-full min-h-0 overflow-y-auto">
          <AIRecommendations
            onApplyRecommendation={handleApplyRecommendation}
          />
          <Tone />
        </div>
      </div>
    </div>
  );
}
