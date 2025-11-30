"use client";

import NextLink from "next/link";
import { Card, CardBody, CardFooter, Button } from "@heroui/react";
import { Files, FileText, Loader2, Check } from "lucide-react";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
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
import { logger } from "@/lib/logger";
import { LoadingScreen } from "@/components/ui/LoadingScreen";
import { cn } from "@/lib/utils";

export function ImportResume() {
  const router = useRouter();
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] =
    useState<ExtractedResumeData | null>(null);
  const [showTemplateSelection, setShowTemplateSelection] = useState(false);
  const [isCreatingResume, setIsCreatingResume] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const importResume = useImportResume();
  const createResumeFromImport = useCreateResumeFromImport();

  // File type validation function - PDF only
  const isValidFileType = (file: File): boolean => {
    const validTypes = ["application/pdf"];
    const validExtensions = [".pdf"];

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
        setUploadedFile(file);
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
      logger.error("Import error:", error);

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

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
  };

  const handleContinueWithTemplate = async () => {
    if (!extractedData || !selectedTemplateId) return;

    setIsCreatingResume(true);

    try {
      const resume = await createResumeFromImport.mutateAsync({
        templateId: selectedTemplateId,
        extractedData,
      });

      router.push(`/resume-builder/editor?resumeId=${resume.id}&step=contact`);
    } catch (error: any) {
      logger.error("Resume creation error:", error);
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
    colorHex?: string,
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
    <>
      {/* Lottie Loading Screen */}
      <LoadingScreen
        isVisible={isProcessing}
        message="Analyzing your resume..."
      />

    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb Section - Matching dashboard layout */}
      <div className="bg-transparent w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Resume Builder", href: "/resume-builder" },
                  { label: "Import Resume", current: true },
                ]}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto px-8 py-8">

        {!showTemplateSelection ? (
          <div className="flex-1 flex flex-col items-center justify-center mt-16">
            <div className="w-full max-w-2xl">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight text-center mb-2">
                Import your <span className="text-emerald-600">existing resume</span> here
              </h1>
              <p className="text-center text-gray-500 mb-8">
                Don&apos;t have a resume yet?{" "}
                <NextLink
                  className="text-green-700 hover:text-green-800 underline"
                  href="/resume-builder/templates"
                >
                  build one
                </NextLink>{" "}
                from scratch.
              </p>

              {/* Drag and Drop Upload Area */}
              <Card
                className={`border-2 border-dashed transition-all duration-200 ${
                  isDragOver
                    ? "border-emerald-400 bg-emerald-50/30"
                    : uploadedFile
                      ? "border-emerald-300 bg-emerald-50/30"
                      : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
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
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                accept=".pdf"
                className="hidden"
                type="file"
                onChange={handleFileSelect}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="w-full max-w-6xl">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight text-center mb-2">
                Choose a template for your resume
              </h1>
              <p className="text-center text-gray-500 mb-8">
                Your data has been extracted. Select a template to see how it
                looks!
              </p>

              {/* Template Selection Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {TEMPLATE_LIST.map((template) => {
                  const isSelected = selectedTemplateId === template.id;
                  return (
                    <Card
                      key={template.id}
                      disableAnimation
                      shadow="none"
                      isPressable
                      className={cn(
                        "cursor-pointer transition-all duration-300 ease-in-out border-2 hover:border-adult-green hover:bg-gray-50/50",
                        isSelected ? "border-adult-green bg-adult-green/5" : "border-gray-200",
                      )}
                      isDisabled={isCreatingResume}
                      onPress={() => handleTemplateSelect(template.id)}
                    >
                      <CardBody className="p-3 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-gray-900 mb-2">
                              {template.name}
                            </h3>
                            <p className="text-xs text-gray-600">{template.description}</p>
                          </div>
                          {isSelected && (
                            <div className="h-5 w-5 rounded-full bg-adult-green flex items-center justify-center flex-shrink-0">
                              <Check className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        {/* Template Preview */}
                        <div className="aspect-[8.5/11] bg-white rounded-md overflow-hidden relative border-2 border-gray-100 transition-all duration-300 pointer-events-none">
                          <div
                            className="w-full h-full pointer-events-none"
                            style={{
                              transform: "scale(0.5)",
                              transformOrigin: "top left",
                              width: "200%",
                              height: "200%",
                            }}
                          >
                            {extractedData && (
                              <ResumePreview
                                resumeData={convertToResumeData(
                                  extractedData,
                                  template.id,
                                  template.colorScheme,
                                )}
                              />
                            )}
                          </div>
                        </div>
                      </CardBody>

                      <CardFooter className="p-3 pt-0">
                        <div className="w-full flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <div
                              className="h-3 w-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: template.colorScheme }}
                            />
                            <span className="text-gray-600 text-xs capitalize">
                              {template.layoutType.replace("-", " ")}
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {template.fontFamily.split(",")[0]}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>

              {/* Continue Button - Sticky on mobile, normal on desktop */}
              {selectedTemplateId && (
                <div className="pt-8">
                  {/* Desktop Button */}
                  <div className="hidden sm:flex justify-center">
                    <Button
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-12 py-3 shadow-lg"
                      size="lg"
                      radius="md"
                      isDisabled={isCreatingResume}
                      isLoading={isCreatingResume}
                      onPress={handleContinueWithTemplate}
                    >
                      {isCreatingResume ? "Creating Resume..." : `Continue with ${TEMPLATE_LIST.find(t => t.id === selectedTemplateId)?.name}`}
                    </Button>
                  </div>

                  {/* Mobile Sticky Button */}
                  <div className="sm:hidden fixed bottom-6 left-4 right-4 z-50">
                    <Button
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-4 shadow-xl"
                      size="lg"
                      radius="md"
                      isDisabled={isCreatingResume}
                      isLoading={isCreatingResume}
                      onPress={handleContinueWithTemplate}
                    >
                      {isCreatingResume ? "Creating..." : `Continue with ${TEMPLATE_LIST.find(t => t.id === selectedTemplateId)?.name}`}
                    </Button>
                  </div>
                </div>
              )}

              {/* Back Button */}
              <div className="mt-8 text-center">
                <Button
                  isDisabled={isCreatingResume}
                  variant="light"
                  onPress={() => {
                    setShowTemplateSelection(false);
                    setExtractedData(null);
                    setUploadedFile(null);
                    setSelectedTemplateId(null);
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

    </>
  );
}
