"use client";

import { Button, Card, CardBody } from "@heroui/react";
import { FileText, Files } from "lucide-react";
import { useRef, useState } from "react";
import { addToast } from "@heroui/toast";
import type { CoverLetterStyle } from "@/types/cover-letter";
import { Tone } from "./Tone";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type CoverLetterLandingProps = {
  onFileUpload: (file: File) => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  isProcessing: boolean;
  selectedStyle: CoverLetterStyle;
  onChangeTone: (newStyle: CoverLetterStyle) => Promise<void>;
};

export function CoverLetterLanding({
  onFileUpload,
  uploadedFile,
  onRemoveFile,
  isProcessing,
  selectedStyle,
  onChangeTone,
}: CoverLetterLandingProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
    ];
    const validExtensions = [".pdf", ".docx", ".doc"];

    return (
      validTypes.includes(file.type) ||
      validExtensions.some((ext) => file.name.toLowerCase().endsWith(ext))
    );
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = e.dataTransfer.files;

    if (files.length > 0) {
      const file = files[0];

      if (isValidFileType(file)) {
        onFileUpload(file);
      } else {
        addToast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          color: "warning",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (isValidFileType(file)) {
        onFileUpload(file);
      } else {
        addToast({
          title: "Invalid file type",
          description: "Please upload a PDF file only.",
          color: "warning",
        });
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Section */}
      <div className="bg-transparent w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Cover Letter", current: true },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="text-center space-y-2.5 max-w-2xl mx-auto mb-10">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
            Create a <span className="text-emerald-600">Cover Letter</span> in a
            Snap!
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Upload your resume and let AI create a personalized cover letter.
          </p>
          <p className="text-xs text-gray-500">
            Don&apos;t worry, you can always customize it afterwards!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left: File Upload */}
          <div className="flex items-start">
            <Card
              className={`w-full border-2 border-dashed transition-all duration-200 ${
                isDragOver
                  ? "border-emerald-400 bg-emerald-50/30"
                  : uploadedFile
                    ? "border-emerald-300 bg-emerald-50/30"
                    : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
              }`}
            >
              <CardBody
                className="p-8 text-center cursor-pointer"
                onClick={handleBrowseClick}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileText className="w-10 h-10 text-emerald-600" />
                    </div>
                    <div className="text-center">
                      <p className="text-base font-medium text-gray-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Remove Button */}
                    <div
                      className="flex justify-center"
                      role="button"
                      tabIndex={0}
                      onClick={(e) => e.stopPropagation()}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.stopPropagation();
                        }
                      }}
                    >
                      <Button
                        color="default"
                        isDisabled={isProcessing}
                        size="sm"
                        variant="bordered"
                        onPress={onRemoveFile}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Files
                        className={`w-10 h-10 ${isDragOver ? "text-emerald-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <p className="text-base font-medium text-gray-900">
                        {isDragOver
                          ? "Drop your resume here"
                          : "Drag and drop your resume"}
                      </p>
                      <p className="text-sm text-gray-500">
                        or{" "}
                        <span className="text-emerald-700 font-medium">
                          browse
                        </span>{" "}
                        to choose a file
                      </p>
                    </div>
                    <p className="text-xs text-gray-400">
                      PDF files only, up to 10MB
                    </p>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right: How it Works */}
          <div className="flex flex-col gap-4">
            <Card className="w-full">
              <CardBody className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  How it Works
                </h2>

                <div className="space-y-4">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                      Step 1: Upload a Resume
                    </h3>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      <li>Upload your current resume in PDF format</li>
                      <li>
                        Choose your preferred tone style (Professional,
                        Conversational, or Modern)
                      </li>
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                      Step 2: AI Recommends a Cover Letter
                    </h3>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      <li>
                        Our AI creates a personalized cover letter and suggests
                        what to add based on your uploaded resume
                      </li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-1.5">
                      Step 3: Customize Your Cover Letter
                    </h3>
                    <ul className="list-disc list-inside text-xs text-gray-600 space-y-1">
                      <li>
                        Review, edit, copy the text, or download your cover
                        letter and you&apos;re done!
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>

            {/* Tone & Style Card - Only show when file is uploaded */}
            {uploadedFile && (
              <Tone
                currentStyle={selectedStyle}
                isInitialGeneration={true}
                onChangeTone={onChangeTone}
              />
            )}
          </div>
        </div>

        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          accept=".pdf,.docx,.doc"
          className="hidden"
          type="file"
          onChange={handleFileSelect}
        />
      </div>
    </div>
  );
}
