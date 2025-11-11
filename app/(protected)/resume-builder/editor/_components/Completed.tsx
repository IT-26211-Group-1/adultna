"use client";

import { Button } from "@heroui/react";
import NextLink from "next/link";
import ResumePreview from "./ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";

interface CompletedProps {
  resumeData: ResumeData;
  setResumeData: (data: ResumeData) => void;
}

export default function Completed({ resumeData }: CompletedProps) {
  const handleExportToPDF = () => {};

  return (
    <div className="flex grow pt-16 flex-col">
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Resume Preview */}
            <div className="bg-white rounded-lg shadow-sm p-8 overflow-auto max-h-[85vh]">
              <ResumePreview resumeData={resumeData} />
            </div>

            {/* Right: Success Message and Actions */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
                <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    You&apos;re all set!
                  </h1>
                  <p className="text-gray-600 italic">
                    Your resume is ready to go :)
                  </p>
                </div>

                <div className="space-y-3">
                  <NextLink className="block" href="/resume-builder/editor">
                    <Button className="w-full py-3 text-base" variant="bordered">
                      Edit Resume
                    </Button>
                  </NextLink>

                  <Button
                    className="w-full py-3 text-base"
                    variant="bordered"
                    onPress={handleExportToPDF}
                  >
                    Export to PDF
                  </Button>

                  <NextLink className="block" href="/cover-letters">
                    <Button className="w-full py-3 text-base" variant="bordered">
                      Create Cover Letter
                    </Button>
                  </NextLink>

                  <NextLink className="block" href="/resume-builder/editor">
                    <Button className="w-full py-3 text-base" variant="bordered">
                      Start New Resume
                    </Button>
                  </NextLink>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
