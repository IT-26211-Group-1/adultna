"use client";

import { useState, useRef } from "react";
import { Card, CardBody, Button, Textarea } from "@heroui/react";
import { Files, FileText, ArrowLeft } from "lucide-react";
import NextLink from "next/link";
import { addToast } from "@heroui/toast";
import { ResumeScoreGauge } from "./ResumeScoreGauge";
import { ResumeVerdict } from "./ResumeVerdict";
import { GraderAIRecommendations } from "./GraderAIRecommendations";
import { CategoryScores } from "./CategoryScores";
import {
  useGradeResume,
  ATSGradingResult,
} from "@/hooks/queries/useResumeQueries";
import { ApiClient } from "@/lib/apiClient";

export default function ResumeGrader() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [gradingResult, setGradingResult] = useState<ATSGradingResult | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gradeResume = useGradeResume();

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
    setGradingResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleGradeResume = async () => {
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

      const result = await gradeResume.mutateAsync({
        fileKey: uploadUrlResponse.data.fileKey,
        fileName: uploadedFile.name,
        jobDescription:
          typeof jobDescription === "string" && jobDescription.trim()
            ? jobDescription.trim()
            : undefined,
      });

      setGradingResult(result);
      setIsProcessing(false);
    } catch (error: any) {
      console.error("Grading error:", error);
      addToast({
        title: "Grading failed",
        description: error?.message || "Failed to grade resume. Please try again.",
        color: "danger",
      });
      setIsProcessing(false);
    }
  };

  const getScoreVerdict = (score: number): string => {
    if (score >= 90) return "Excellent!";
    if (score >= 75) return "Good!";
    if (score >= 60) return "Fair";

    return "Needs Work";
  };

  const getCategoryStrengths = () => {
    if (!gradingResult) return [];

    const allStrengths: string[] = [];
    const metricsCount =
      gradingResult.categoryScores.contentQuality.quantifiableMetricsCount || 0;

    if (metricsCount >= 5) {
      allStrengths.push(
        `Strong quantifiable achievements (${metricsCount} metrics found)`,
      );
    }

    Object.values(gradingResult.categoryScores).forEach((category) => {
      allStrengths.push(...category.strengths);
    });

    return allStrengths.slice(0, 4);
  };

  if (!gradingResult) {
    return (
      <div className="h-[100dvh] bg-gray-50 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <NextLink
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              href="/resume-builder"
            >
              <ArrowLeft className="mr-2" size={20} />
              Back to Resume Builder
            </NextLink>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-3xl font-semibold font-playfair mb-2">
              ATS Resume Grader
            </h1>
            <p className="text-gray-500">
              Upload your resume to get an ATS compatibility score and
              personalized recommendations
            </p>
          </div>

          <Card className="mb-6">
            <CardBody className="p-6">
              <label
                className="block text-sm font-medium text-gray-700 mb-2"
                htmlFor="job-description-input"
              >
                Job Description (Optional)
              </label>
              <Textarea
                className="mb-4"
                id="job-description-input"
                maxRows={8}
                minRows={4}
                placeholder="Paste the job description here for targeted ATS analysis and keyword matching..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
              />
              <p className="text-xs text-gray-500">
                Adding a job description helps us analyze how well your resume
                matches specific requirements
              </p>
            </CardBody>
          </Card>

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
                      variant="solid"
                      onPress={handleGradeResume}
                    >
                      {isProcessing ? "Analyzing..." : "Grade My Resume"}
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
                      <span className="text-green-700 font-medium">browse</span>{" "}
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

  return (
    <div className="h-[100dvh] bg-gray-50 p-6 overflow-hidden">
      <div className="mb-4">
        <Button
          startContent={<ArrowLeft size={16} />}
          variant="light"
          onPress={handleRemoveFile}
        >
          Grade Another Resume
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-[1600px] mx-auto h-full">
        <div className="flex flex-col h-full min-h-0">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 flex flex-col h-full overflow-y-auto">
            <div className="mb-6">
              <ResumeScoreGauge
                score={gradingResult.overallScore}
                verdict={getScoreVerdict(gradingResult.overallScore)}
              />
            </div>

            <div className="flex-1">
              <ResumeVerdict
                verdict={gradingResult.summary}
                workingWell={getCategoryStrengths()}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-6 h-full p-3 min-h-0 overflow-y-auto">
          <GraderAIRecommendations
            recommendations={gradingResult.recommendations}
          />
          <CategoryScores categoryScores={gradingResult.categoryScores} />
        </div>
      </div>
    </div>
  );
}
