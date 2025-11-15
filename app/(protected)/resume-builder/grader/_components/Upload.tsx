"use client";

import NextLink from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { ArrowLeft, Files, FileText, Lightbulb } from "lucide-react";
import { useState, useRef } from "react";
import { addToast } from "@heroui/toast";

export function Upload() {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // File type validation function
  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword", // DOC (legacy)
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
        setUploadedFile(file);
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
        setUploadedFile(file);
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

  const handleRemoveFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col py-16 w-full h-full">
      <div className="flex-1 m-6 border-2 border-gray-300 rounded-xl flex flex-col p-8 relative">
        {/* Back Button */}
        <div className="absolute top-6 left-6">
          <NextLink
            className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            href="/resume-builder"
          >
            <ArrowLeft className="mr-2" size={20} />
            Back
          </NextLink>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="w-full max-w-2xl space-y-6">
            {/* Header */}
            <div>
              <h1 className="text-3xl font-semibold font-playfair text-center mb-2">
                Grade Your Resume
              </h1>
              <p className="text-center text-gray-500">
                Get an instant ATS-friendly analysis of your resume with
                AI-powered recommendations for improvement
              </p>
            </div>

            {/* Drag and Drop Upload Area */}
            <Card
              className={`border-2 border-dashed transition-all duration-200 ${
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
                  // File uploaded state
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
                    <div className="flex gap-3 justify-center">
                      <Button
                        color="success"
                        variant="solid"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Add logic for grading the resume
                        }}
                      >
                        Grade Resume
                      </Button>
                      <Button
                        color="default"
                        variant="bordered"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Default upload state
                  <div className="space-y-4">
                    <div className="flex items-center justify-center">
                      <Files
                        className={`w-12 h-12 ${isDragOver ? "text-green-600" : "text-gray-400"}`}
                      />
                    </div>
                    <div>
                      <p className="text-lg font-medium text-gray-900">
                        {isDragOver
                          ? "Drop your resume here"
                          : "Choose a file or drop one here"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        PDF, Word Document (.DOCX)
                      </p>
                    </div>
                    <Button
                      className="bg-adult-green hover:bg-[#0e4634] text-white"
                      variant="solid"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBrowseClick();
                      }}
                    >
                      Browse Files
                    </Button>
                  </div>
                )}
              </CardBody>
            </Card>

            {/* AI-Powered Analysis Disclaimer */}
            <Card className="bg-amber-50 border border-amber-200">
              <CardBody className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 pt-0.5">
                    <Lightbulb className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-amber-900 mb-1">
                      AI-Powered Analysis Disclaimer
                    </h3>
                    <p className="text-xs text-amber-800 leading-relaxed">
                      This resume analysis is powered by artificial intelligence
                      and provides general recommendations. While our AI is
                      trained on industry best practices and ATS requirements,
                      results should be used as guidance alongside professional
                      judgment. Individual results may vary based on specific
                      industries, roles, and company requirements.
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>

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
      </div>
    </div>
  );
}
