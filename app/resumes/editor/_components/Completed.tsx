"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { FileText, Download, Mail, RotateCcw } from "lucide-react";
import NextLink from "next/link";
import ResumePreview from "./ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";
import { Navbar } from "@/components/ui/Navbar";

interface CompletedProps {
  resumeData: ResumeData;
}

export default function Completed({ resumeData }: CompletedProps) {

  const handleExportToPDF = () => {

  };

  return (
    <div className="flex grow pt-16 flex-col">
      <header className="space-y-1.5 border-b px-3 py-5 text-center">
        <Navbar/>
      </header>
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Left side - Resume Preview */}
          <div className="flex flex-col">
            <div className="bg-white rounded-lg shadow-sm p-6 flex-1">
              <ResumePreview resumeData={resumeData} />
            </div>
          </div>

          {/* Right side - Completion Message and Actions */}
          <div className="flex flex-col justify-center space-y-6">
            <div className="text-center space-y-4"> 
              <h1 className="text-3xl font-bold text-gray-900">
                You're all set!
              </h1>
              
              <p className="text-lg text-gray-600">
                Your resume is ready to go :)
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4 max-w-md mx-auto w-full">
              <NextLink href="/resumes/editor" className="block">
                <Button
                  variant="bordered"
                  className="w-full py-3 text-base"
                >
                  Edit Resume
                </Button>
              </NextLink>

              <Button
                onClick={handleExportToPDF}
                variant="bordered"
                className="w-full py-3 text-base"
              >
                Export to PDF
              </Button>

              <NextLink href="/cover-letters" className="block">
                <Button
                  variant="bordered"
                  className="w-full py-3 text-base"
                >
                  Create Cover Letter
                </Button>
              </NextLink>

              <NextLink href="/resumes/editor" className="block">
                <Button
                  variant="bordered"
                  className="w-full py-3 text-base"
                >
                  Start New Resume
                </Button>
              </NextLink>
            </div>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}