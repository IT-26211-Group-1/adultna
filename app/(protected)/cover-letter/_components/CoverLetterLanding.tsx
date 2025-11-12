"use client";

import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react";
import { FileText, Upload, Files } from "lucide-react";
import { useRef, useState } from "react";
import { addToast } from "@heroui/toast";
import type { CoverLetterStyle } from "@/types/cover-letter";

type CoverLetterLandingProps = {
  onFileUpload: (file: File) => void;
  onGenerateCoverLetter: () => void;
  uploadedFile: File | null;
  onRemoveFile: () => void;
  isProcessing: boolean;
  selectedStyle: CoverLetterStyle;
  onStyleChange: (style: CoverLetterStyle) => void;
};

export function CoverLetterLanding({
  onFileUpload,
  onGenerateCoverLetter,
  uploadedFile,
  onRemoveFile,
  isProcessing,
  selectedStyle,
  onStyleChange,
}: CoverLetterLandingProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const styleOptions = [
    { key: "formal", label: "Professional", description: "Traditional professional tone" },
    { key: "conversational", label: "Conversational", description: "Friendly yet professional" },
    { key: "modern", label: "Modern", description: "Contemporary and engaging" },
  ];

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
          description: "Please upload a PDF or DOCX file only.",
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
          description: "Please upload a PDF or DOCX file only.",
          color: "warning",
        });
      }
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Create a Cover Letter in a Snap!
          </h1>
          <p className="text-lg text-gray-700 mb-2">
            Upload your resume and let AI create a personalized cover letter.
          </p>
          <p className="text-sm italic text-gray-600">
            Don&apos;t worry, you can always customize it afterwards!
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: File Upload */}
          <div className="flex items-start">
            <Card
              className={`w-full border-2 border-dashed transition-all duration-200 ${
                isDragOver
                  ? "border-green-400 bg-green-50"
                  : uploadedFile
                    ? "border-green-300 bg-green-50"
                    : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <CardBody
                className="p-12 text-center cursor-pointer"
                onClick={handleBrowseClick}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                {uploadedFile ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <FileText className="w-12 h-12 text-green-600" />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {uploadedFile.name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>

                    {/* Style Selector */}
                    <div
                      className="max-w-xs mx-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Select
                        label="Choose Tone Style"
                        selectedKeys={[selectedStyle]}
                        size="sm"
                        variant="bordered"
                        classNames={{
                          label: "text-gray-700 font-medium",
                        }}
                        onSelectionChange={(keys) => {
                          const selected = Array.from(keys)[0] as CoverLetterStyle;
                          onStyleChange(selected);
                        }}
                      >
                        {styleOptions.map((option) => (
                          <SelectItem
                            key={option.key}
                            textValue={option.label}
                            description={option.description}
                          >
                            <div>
                              <div className="font-medium">{option.label}</div>
                              <div className="text-xs text-gray-500">{option.description}</div>
                            </div>
                          </SelectItem>
                        ))}
                      </Select>
                    </div>

                    <div
                      className="flex gap-3 justify-center"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        color="success"
                        isDisabled={isProcessing}
                        isLoading={isProcessing}
                        variant="solid"
                        onPress={onGenerateCoverLetter}
                      >
                        {isProcessing
                          ? "Generating..."
                          : "Generate Cover Letter"}
                      </Button>
                      <Button
                        color="default"
                        isDisabled={isProcessing}
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
                        className={`w-16 h-16 ${isDragOver ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Choose a file or drop one here
                      </h3>
                      <p className="text-sm text-gray-500 mb-6">
                        PDF, Word Document (.DOCX)
                      </p>
                    </div>
                    <div onClick={(e) => e.stopPropagation()}>
                      <Button
                        className="bg-[#d4e4d8] hover:bg-[#c0d6c9] text-gray-800"
                        size="lg"
                        onPress={handleBrowseClick}
                      >
                        Browse Files
                      </Button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          </div>

          {/* Right: How it Works */}
          <div className="flex items-start">
            <Card className="w-full">
              <CardBody className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  How it Works
                </h2>

                <div className="space-y-6">
                  {/* Step 1 */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Step 1: Upload a Resume
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>
                        Upload your current resume in PDF or Word format
                      </li>
                      <li>
                        Choose your preferred tone style (Professional, Conversational, or Modern)
                      </li>
                    </ul>
                  </div>

                  {/* Step 2 */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Step 2: AI Recommends a Cover Letter
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>
                        Our AI creates a personalized cover letter and suggests
                        what to add based on your uploaded resume
                      </li>
                    </ul>
                  </div>

                  {/* Step 3 */}
                  <div>
                    <h3 className="text-base font-semibold text-gray-900 mb-2">
                      Step 3: Customize Your Cover Letter
                    </h3>
                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                      <li>
                        Review, edit, copy the text, or download your cover
                        letter and you&apos;re done!
                      </li>
                    </ul>
                  </div>
                </div>
              </CardBody>
            </Card>
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
