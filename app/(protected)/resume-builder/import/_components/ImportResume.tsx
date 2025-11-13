"use client";

import NextLink from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import { ArrowLeft, Files, FileText, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import {
  useImportResume,
  useCreateResumeFromImport,
  ExtractedResumeData,
} from "@/hooks/queries/useResumeQueries";
import { TEMPLATE_LIST } from "@/constants/templates";
import ResumePreview from "../../editor/_components/ResumePreview";
import { ResumeData } from "@/validators/resumeSchema";
import { ApiClient } from "@/lib/apiClient";

export function ImportResume() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] =
    useState<ExtractedResumeData | null>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importResume = useImportResume();
  const createResumeFromImport = useCreateResumeFromImport();

  // File type validation function
  const isValidFileType = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // DOCX
      "application/msword", // DOC (legacy)
    ];
    // Since we only accept pdf and word documents
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

      // Only accept PDF and DOCX files
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

  const handleImportResume = async () => {
    if (!uploadedFile) return;

    const fileSizeMB = uploadedFile.size / (1024 * 1024);

    if (fileSizeMB > 10) {
      addToast({
        title: "File too large",
        description: "Please upload a file smaller than 10MB",
        color: "warning",
      });

      return;
    }

    setIsProcessing(true);

    try {
      const uploadUrlResponse = await ApiClient.post<{
        success: boolean;
        data: { uploadUrl: string; fileKey: string };
      }>("/resumes/generate-upload-url", {
        fileName: uploadedFile.name,
        contentType: uploadedFile.type,
        fileSize: uploadedFile.size,
      });

      if (!uploadUrlResponse.success) {
        throw new Error("Failed to generate upload URL");
      }

      await fetch(uploadUrlResponse.data.uploadUrl, {
        method: "PUT",
        body: uploadedFile,
        headers: {
          "Content-Type": uploadedFile.type,
          "Content-Disposition": "inline",
        },
      });

      const result = await importResume.mutateAsync({
        fileKey: uploadUrlResponse.data.fileKey,
        fileName: uploadedFile.name,
      });

      setExtractedData(result);
      setIsProcessing(false);
      setShowTemplateSelection(true);
    } catch (error: any) {
      console.error("Import error:", error);

      if (error?.message?.includes("RATE_LIMIT_EXCEEDED")) {
        addToast({
          title: "Too many requests",
          description: "Please try again in a moment.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Import failed",
          description:
            error?.message || "Failed to import resume. Please try again.",
          color: "danger",
        });
      }
      setIsProcessing(false);
    }
  };

  const handleTemplateSelect = async (templateId: string) => {
    if (!extractedData) return;

    setIsCreatingResume(true);

    try {
      const resume = await createResumeFromImport.mutateAsync({
        templateId,
        extractedData,
      });

      router.push(`/resume-builder/editor?resumeId=${resume.id}&step=contact`);
    } catch (error: any) {
      console.error("Resume creation error:", error);
      addToast({
        title: "Creation failed",
        description:
          error?.message || "Failed to create resume. Please try again.",
        color: "danger",
      });
      setIsCreatingResume(false);
    }
  };

  const convertToResumeData = (
    data: ExtractedResumeData,
    templateId: string,
    colorHex?: string
  ): ResumeData & { colorHex?: string } => {
    return {
      templateId: templateId as any,
      colorHex,
      firstName: data.firstName || "",
      lastName: data.lastName || "",
      email: data.email || "",
      phone: data.phone || "",
      jobPosition: data.jobPosition,
      city: data.location,
      linkedin: data.linkedIn,
      portfolio: data.portfolio,
      summary: data.summary,
      workExperiences: data.workExperiences.map((work) => ({
        jobTitle: work.jobTitle,
        employer: work.employer,
        startDate: work.startDate ? new Date(work.startDate) : undefined,
        endDate: work.endDate ? new Date(work.endDate) : undefined,
        isCurrentlyWorkingHere: work.currentlyWorking,
        description: work.description,
      })),
      educationItems: data.educationItems.map((edu) => ({
        degree: edu.degree,
        fieldOfStudy: edu.fieldOfStudy,
        schoolName: edu.institution,
        schoolLocation: edu.location,
        graduationDate: edu.graduationDate
          ? new Date(edu.graduationDate)
          : undefined,
      })),
      skills: data.skills.map((skill) => ({
        skill: skill,
      })),
      certificates: data.certifications.map((cert) => ({
        certificate: cert.name,
        issuingOrganization: cert.issuingOrganization,
      })),
    };
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

        {!showTemplateSelection ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-2xl">
              <h1 className="text-3xl font-semibold font-playfair text-center mb-2">
                Import your existing resume here
              </h1>
              <p className="text-center text-gray-500 mb-8">
                Don&apos;t have a resume yet?{" "}
                <NextLink
                  className="text-green-700 hover:text-green-800 underline"
                  href="/resume-builder/editor"
                >
                  build one
                </NextLink>{" "}
                from scratch.
              </p>

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
                          isDisabled={isProcessing}
                          isLoading={isProcessing}
                          startContent={
                            isProcessing ? (
                              <Loader2 className="animate-spin" size={16} />
                            ) : null
                          }
                          variant="solid"
                          onPress={handleImportResume}
                        >
                          {isProcessing ? "Processing..." : "Import Resume"}
                        </Button>
                        <Button
                          color="default"
                          isDisabled={isProcessing}
                          variant="bordered"
                          onPress={handleRemoveFile}
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
                            : "Drag and drop your resume"}
                        </p>
                        <p className="text-sm text-gray-500">
                          or{" "}
                          <span className="text-green-700 font-medium">
                            browse
                          </span>{" "}
                          to choose a file
                        </p>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF, DOCX, and DOC files only, up to 10MB
                      </p>
                    </div>
                  )}
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
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl">
              <h1 className="text-3xl font-semibold font-playfair text-center mb-2">
                Choose a template for your resume
              </h1>
              <p className="text-center text-gray-500 mb-8">
                Your data has been extracted. Select a template to see how it
                looks!
              </p>

              {/* Template Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TEMPLATE_LIST.map((template) => (
                  <Card
                    key={template.id}
                    disableAnimation
                    isPressable
                    className="border-2 border-gray-200 hover:border-green-500 hover:shadow-lg transition-all"
                    isDisabled={isCreatingResume}
                    onPress={() => handleTemplateSelect(template.id)}
                  >
                    <CardBody className="p-4">
                      <div className="mb-3">
                        {extractedData && (
                          <ResumePreview
                            resumeData={convertToResumeData(
                              extractedData,
                              template.id,
                              template.colorScheme
                            )}
                          />
                        )}
                      </div>
                      <h3 className="font-semibold text-lg mb-1">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600 mb-3">
                        {template.description}
                      </p>
                      <div className="w-full px-4 py-2 bg-success-50 text-success-700 rounded-lg text-center text-sm font-medium">
                        {isCreatingResume ? "Creating..." : "Select Template"}
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              {/* Back Button */}
              <div className="mt-8 text-center">
                <Button
                  isDisabled={isCreatingResume}
                  variant="light"
                  onPress={() => {
                    setShowTemplateSelection(false);
                    setExtractedData(null);
                    setUploadedFile(null);
                  }}
                >
                  ← Upload a different resume
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
