"use client";

import { useState, useRef, useEffect } from "react";
import { Textarea } from "@heroui/react";
import { Files, FileText, Upload, Search } from "lucide-react";
import { useResumes } from "@/hooks/queries/useResumeQueries";
import NextLink from "next/link";
import { useSearchParams } from "next/navigation";
import { addToast } from "@heroui/toast";
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { Button } from "@heroui/react";
import GaugeComponent from "react-gauge-component";
import { GraderAIRecommendations } from "./GraderAIRecommendations";
import { CategoryScores } from "./CategoryScores";
import { ResumeVerdict } from "./ResumeVerdict";
import { ResumePreview } from "./ResumePreview";
import {
  useGradeResume,
  ATSGradingResult,
} from "@/hooks/queries/useResumeQueries";
import { ApiClient } from "@/lib/apiClient";
import { logger } from "@/lib/logger";
import { ArrowLeft } from "lucide-react";

interface ResumeGraderProps {
  onResultsChange?: (showingResults: boolean) => void;
}

export default function ResumeGrader({
  onResultsChange,
}: ResumeGraderProps = {}) {
  const searchParams = useSearchParams();
  const { getSecureItem, setSecureItem, removeSecureItem } = useSecureStorage();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [gradingResult, setGradingResult] = useState<ATSGradingResult | null>(
    null,
  );
  const [gradeSearchQuery, setGradeSearchQuery] = useState<string>("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const gradeResume = useGradeResume();
  const { data: resumesData = [], isLoading: isLoadingResumes } = useResumes();

  // Check if we should show results based on URL params
  const showResults = searchParams.get("results") === "true";

  // Restore grading results from secure storage on component mount
  useEffect(() => {
    if (showResults && !gradingResult) {
      const savedResults = getSecureItem("resumeGradingResults");

      if (savedResults) {
        try {
          const parsedResults = JSON.parse(savedResults);

          setGradingResult(parsedResults);
        } catch (error) {
          console.error("Failed to parse saved grading results:", error);
          // Clear invalid data
          removeSecureItem("resumeGradingResults");
        }
      }
    }
  }, [showResults, gradingResult, getSecureItem, removeSecureItem]);

  // Notify parent component when results state changes
  useEffect(() => {
    if (onResultsChange) {
      onResultsChange(!!gradingResult || showResults);
    }
  }, [gradingResult, showResults, onResultsChange]);

  // Filter resumes for grade section
  const filteredGradeResumes = resumesData
    .filter((resume) => {
      if (!gradeSearchQuery.trim()) return true;
      const query = gradeSearchQuery.toLowerCase().trim();

      return (
        resume.title.toLowerCase().includes(query) ||
        (resume.firstName && resume.firstName.toLowerCase().includes(query)) ||
        (resume.lastName && resume.lastName.toLowerCase().includes(query)) ||
        resume.status.toLowerCase().includes(query)
      );
    })
    .sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

      return dateB - dateA;
    });

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
    setGradingResult(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    // Clear secure storage
    removeSecureItem("resumeGradingResults");

    // Clear URL params to go back to upload state
    const newUrl = new URL(window.location.href);

    newUrl.searchParams.delete("results");
    newUrl.searchParams.delete("resumeId");
    window.history.replaceState({}, "", newUrl.toString());
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

      // Save results to secure storage for persistence across refreshes
      setSecureItem("resumeGradingResults", JSON.stringify(result));

      // Update URL to persist results state
      const newUrl = new URL(window.location.href);

      newUrl.searchParams.set("results", "true");
      window.history.replaceState({}, "", newUrl.toString());
    } catch (error: any) {
      logger.error("Grading error:", error);

      if (error?.message?.includes("RATE_LIMIT_EXCEEDED")) {
        addToast({
          title: "Too many requests",
          description: "Please try again in a moment.",
          color: "warning",
        });
      } else {
        addToast({
          title: "Grading failed",
          description:
            error?.message || "Failed to grade resume. Please try again.",
          color: "danger",
        });
      }
      setIsProcessing(false);
    }
  };

  const getScoreVerdict = (passRate: string): string => {
    if (passRate === "excellent") return "Excellent!";
    if (passRate === "good") return "Good!";
    if (passRate === "fair") return "Fair";

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

  if (!gradingResult && !showResults) {
    return (
      <div className="w-full">
        <div className="max-w-7xl mx-auto px-8">
          <div className="space-y-8 animate-[fadeIn_0.4s_ease-out]">
            {/* Hero Section */}
            <div className="text-center space-y-2.5 max-w-2xl mx-auto">
              <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">
                Grade Your Resume
              </h1>
              <p className="text-sm text-gray-600 leading-relaxed">
                Get AI-powered feedback and recommendations to make your resume
                stand out.
              </p>
            </div>

            {/* Two Column Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column - Job Description & File Upload */}
              <div className="space-y-6" style={{ minHeight: "500px" }}>
                {/* Job Description Section */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <label
                    className="block text-sm font-semibold text-gray-900 mb-3"
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
                    Adding a job description helps us analyze how well your
                    resume matches specific requirements
                  </p>
                </div>

                {/* Upload Area */}
                <div
                  className={`bg-white border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300 cursor-pointer group ${
                    isDragOver
                      ? "border-emerald-400 bg-emerald-50/30"
                      : uploadedFile
                        ? "border-emerald-300 bg-emerald-50/30"
                        : "border-gray-300 hover:border-emerald-400 hover:bg-emerald-50/30"
                  }`}
                  onClick={handleBrowseClick}
                  onDragLeave={handleDragLeave}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <FileText className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                          {uploadedFile.name}
                        </h3>
                        <p className="text-xs text-gray-600">
                          {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <div className="flex gap-3 justify-center">
                        <button
                          className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all duration-200 disabled:opacity-50"
                          disabled={isProcessing}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleGradeResume();
                          }}
                        >
                          {isProcessing ? "Grading..." : "Grade My Resume"}
                        </button>
                        <button
                          className="px-5 py-2 rounded-lg text-sm font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition-all duration-200 disabled:opacity-50"
                          disabled={isProcessing}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveFile();
                          }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-emerald-100 w-14 h-14 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900 mb-1.5">
                          {isDragOver
                            ? "Drop your resume here"
                            : "Upload Resume to Grade"}
                        </h3>
                        <p className="text-xs text-gray-600 mb-4">
                          Drop your resume here or click to browse
                        </p>
                        <button className="bg-emerald-600 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all duration-200">
                          Choose File
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">
                        PDF files only, up to 10MB
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Search My Resumes */}
              <div className="space-y-6">
                {!isLoadingResumes && resumesData.length > 0 && (
                  <div
                    className="bg-white border border-gray-200 rounded-xl"
                    style={{ minHeight: "500px" }}
                  >
                    {/* Header with Search */}
                    <div className="p-5 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-900 mb-3">
                        Grade from My Resumes
                      </h3>
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                          placeholder="Search your resumes..."
                          type="text"
                          value={gradeSearchQuery}
                          onChange={(e) => setGradeSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Resume List */}
                    <div className="max-h-96 overflow-y-auto">
                      {filteredGradeResumes.length === 0 ? (
                        <div className="p-5 text-center">
                          <FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                          <p className="text-sm text-gray-500">
                            {gradeSearchQuery.trim()
                              ? "No resumes match your search"
                              : "No resumes available"}
                          </p>
                        </div>
                      ) : (
                        <div className="p-2">
                          {filteredGradeResumes.map((resume, index) => (
                            <div key={resume.id}>
                              <NextLink
                                href={`/resume-builder/grader?resumeId=${resume.id}`}
                              >
                                <button className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50/50 transition-all duration-200 text-left group">
                                  <div className="flex items-center gap-3 min-w-0 flex-1">
                                    <div className="flex-shrink-0">
                                      <FileText className="w-4 h-4 text-gray-400 group-hover:text-emerald-600 transition-colors duration-200" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="text-sm font-medium text-gray-900 truncate group-hover:text-emerald-700 transition-colors">
                                        {resume.title}
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-shrink-0 ml-3">
                                    <span
                                      className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${
                                        resume.status === "completed"
                                          ? "bg-emerald-100 text-emerald-700"
                                          : resume.status === "draft"
                                            ? "bg-amber-100 text-amber-700"
                                            : "bg-gray-100 text-gray-700"
                                      }`}
                                    >
                                      {resume.status.charAt(0).toUpperCase() +
                                        resume.status.slice(1)}
                                    </span>
                                  </div>
                                </button>
                              </NextLink>
                              {index < filteredGradeResumes.length - 1 && (
                                <div className="border-b border-gray-100 mx-3" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Footer with count */}
                    <div className="px-5 py-3 bg-gray-50 border-t border-gray-200 rounded-b-xl">
                      <p className="text-xs text-gray-500 text-center">
                        {filteredGradeResumes.length === resumesData.length
                          ? `${resumesData.length} resume${resumesData.length !== 1 ? "s" : ""} available`
                          : `${filteredGradeResumes.length} of ${resumesData.length} resume${resumesData.length !== 1 ? "s" : ""}`}
                      </p>
                    </div>
                  </div>
                )}

                {/* Empty state when no resumes */}
                {!isLoadingResumes && resumesData.length === 0 && (
                  <div
                    className="bg-white border border-gray-200 rounded-xl flex flex-col justify-center items-center text-center"
                    style={{ minHeight: "535px" }}
                  >
                    <Files className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">
                      No saved resumes
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">
                      Create your first resume to grade it later
                    </p>
                    <NextLink href="/resume-builder/templates">
                      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-all duration-200">
                        Create Resume
                      </button>
                    </NextLink>
                  </div>
                )}
              </div>
            </div>

            <input
              ref={fileInputRef}
              accept=".pdf"
              className="hidden"
              type="file"
              onChange={handleFileSelect}
            />
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}</style>
      </div>
    );
  }

  // If we're showing results but gradingResult is null (after refresh), redirect back to upload
  if (showResults && !gradingResult) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Results not found. Please grade your resume again.
          </p>
          <Button onPress={handleRemoveFile}>Back to Grade Resume</Button>
        </div>
      </div>
    );
  }

  // Calculate score percentage for gauge
  const scorePercentage = gradingResult
    ? Math.round(
        (gradingResult.overallScore / gradingResult.maxPossibleScore) * 100,
      )
    : 0;
  const scoreLabel = gradingResult
    ? getScoreVerdict(gradingResult.passRate)
    : "Unknown";

  return (
    <div className="w-full">
      <div className="w-full">
        {/* Back Navigation */}
        <div className="mb-4 px-2">
          <button
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 group"
            onClick={handleRemoveFile}
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
            <span className="text-sm font-medium">Back to Grade Resume</span>
          </button>
        </div>

        {/* Hero Section - Celebration */}
        <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium mb-6">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              clipRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              fillRule="evenodd"
            />
          </svg>
          Resume Analysis Complete
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 leading-tight">
          Great Job!
          <br />
          <span className="text-adult-green">
            Your Resume Has Been Analyzed
          </span>
        </h1>
        <p className="text-base text-gray-600 max-w-2xl mx-auto leading-relaxed">
          Your resume has been thoroughly analyzed using AI-powered insights.
          {gradingResult?.hasJobDescription &&
            " We've provided tailored feedback based on your target job description."}
          Here's how your resume performs and what you can improve to land your
          dream job.
        </p>
      </div>

      {/* Top Row - Score/Verdict & Resume Preview */}
      <div className="grid lg:grid-cols-[35%_65%] gap-1 mb-4 px-1">
        {/* Left: Score & Verdict */}
        <div className="space-y-8">
          {/* Score Section */}
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Your Resume Score
            </h2>

            {/* Professional Gauge Component */}
            <div className="w-80 h-56 mx-auto mb-6">
              <GaugeComponent
                arc={{
                  colorArray: ["#EF4444", "#F59E0B", "#10B981"],
                  padding: 0.02,
                  subArcs: [{ limit: 40 }, { limit: 70 }, { limit: 100 }],
                }}
                labels={{
                  valueLabel: {
                    formatTextValue: (value: number) => `${value}%`,
                    style: {
                      fontSize: "48px",
                      fontWeight: "bold",
                      fill: "#1F2937",
                    },
                  },
                }}
                pointer={{
                  type: "blob",
                  animationDelay: 0,
                }}
                type="semicircle"
                value={scorePercentage}
              />
              {/* Score Label Below */}
              <div className="text-center mt-4">
                <p className="text-xl font-semibold text-adult-green">
                  {scoreLabel}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Verdict */}
          {gradingResult?.summary && (
            <div>
              <ResumeVerdict
                verdict={gradingResult.summary}
                workingWell={getCategoryStrengths()}
                hasJobDescription={gradingResult.hasJobDescription}
              />
            </div>
          )}
        </div>

        {/* Right: Resume Preview */}
        <div>
          <ResumePreview
            fileName={uploadedFile?.name || "Resume.pdf"}
            fileSize={uploadedFile?.size}
            fileUrl={gradingResult ? URL.createObjectURL(uploadedFile!) : undefined}
            className="w-full"
          />
        </div>
      </div>

      {/* Bottom Row - AI Recommendations & Category Analysis */}
      <div className="grid lg:grid-cols-2 gap-1 mb-4 px-1">
        {/* Left: AI Recommendations */}
        {gradingResult?.recommendations && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              AI Recommendations
            </h3>
            <GraderAIRecommendations
              recommendations={gradingResult.recommendations}
            />
          </div>
        )}

        {/* Right: Category Analysis */}
        {gradingResult?.categoryScores && (
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-6">
              Detailed Category Analysis
            </h3>
            <CategoryScores categoryScores={gradingResult.categoryScores} />
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
