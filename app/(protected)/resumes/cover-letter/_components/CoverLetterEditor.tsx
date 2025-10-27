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
    // You can add a toast notification here
  };

  const handleDownloadPDF = () => {
    // Implement PDF download functionality
    console.log("Download PDF functionality to be implemented");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1800px] mx-auto">
        {/* Left Column - Cover Letter Preview */}
        <div className="space-y-4 max-h-[25vh]">
          <Card>
            <CardBody className="p-4">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold">Cover Letter Preview</h2>
                <p className="text-sm text-gray-600">
                  AI-generated based on your resume
                </p>
              </div>
            </CardBody>
          </Card>

          <div className="flex items-start justify-center bg-white p-6 rounded-lg">
            <div className="w-full max-w-[500px]">
              <CoverLetterPreview content={coverLetterContent} />
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              variant="bordered"
              className="flex-1"
              onClick={handleCopyText}
              isDisabled={coverLetterContent.length === 0}
            >
              Copy Text
            </Button>
            <Button
              variant="bordered"
              className="flex-1"
              onClick={handleDownloadPDF}
              isDisabled={coverLetterContent.length === 0}
            >
              Download as PDF
            </Button>
          </div>
        </div>

        {/* Right Column - AI Recommendations & Tone */}
        <div className="space-y-6">
          <AIRecommendations onApplyRecommendation={handleApplyRecommendation} />
          <Tone />
        </div>
      </div>
    </div>
  );
}
