"use client";

import {
  useResumes,
  useDeleteResume,
  useExportResume,
} from "@/hooks/queries/useResumeQueries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardBody, Button } from "@heroui/react";
import {
  ArrowLeft,
  FileText,
  Trash2,
  Edit,
  Plus,
  Download,
} from "lucide-react";
import { useState } from "react";
import ResumeListSkeleton from "./ResumeListSkeleton";
import ReverseChronologicalTemplate from "../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../templates/_components/HybridTemplate";

export function ResumeList() {
  const router = useRouter();
  const { data: resumes = [], isLoading } = useResumes();
  const deleteResume = useDeleteResume();
  const exportResume = useExportResume();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);

  const handleEdit = (resumeId: string) => {
    router.push(`/resume-builder/editor?resumeId=${resumeId}`);
  };

  const handleDelete = async (resumeId: string) => {
    if (confirm("Are you sure you want to delete this resume?")) {
      setDeletingId(resumeId);
      try {
        await deleteResume.mutateAsync(resumeId);
      } finally {
        setDeletingId(null);
      }
    }
  };

  const handleExport = async (resumeId: string) => {
    setExportingId(resumeId);
    try {
      await exportResume.mutateAsync(resumeId);
    } finally {
      setExportingId(null);
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatResumeDate = (dateValue: any): string => {
    if (!dateValue) return "";
    try {
      if (dateValue && typeof dateValue === "object" && "year" in dateValue) {
        return new Date(
          dateValue.year,
          dateValue.month - 1,
          dateValue.day,
        ).toLocaleDateString("en-US", { year: "numeric" });
      }
      const date = new Date(dateValue);

      if (isNaN(date.getTime())) return "Invalid Date";

      return date.toLocaleDateString("en-US", { year: "numeric" });
    } catch {
      return "Invalid Date";
    }
  };

  const normalizeSkills = (skills: any): string[] => {
    if (!Array.isArray(skills)) return [];

    return skills.map((skill) =>
      typeof skill === "string" ? skill : skill.skill,
    );
  };

  const normalizeCertificates = (certificates: any) => {
    if (!Array.isArray(certificates)) return [];

    return certificates.map((cert) =>
      typeof cert === "string" ? { certificate: cert } : cert,
    );
  };

  const getTemplateComponent = (resume: any) => {
    // Normalize the resume data to match the expected format
    const normalizedResume = {
      ...resume,
      skills: normalizeSkills(resume.skills),
      certificates: normalizeCertificates(resume.certificates),
    };

    const props = {
      resumeData: normalizedResume,
      formatDate: formatResumeDate,
    };

    switch (resume.templateId) {
      case "reverse-chronological":
        return <ReverseChronologicalTemplate {...props} />;
      case "modern":
        return <ModernTemplate {...props} />;
      case "skill-based":
        return <SkillBasedTemplate {...props} />;
      case "hybrid":
        return <HybridTemplate {...props} />;
      default:
        return <ReverseChronologicalTemplate {...props} />;
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            href="/resume-builder"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
        </div>
        <Button
          as={Link}
          className="bg-adult-green text-white"
          color="success"
          href="/resume-builder/templates"
          startContent={<Plus className="w-4 h-4" />}
        >
          Create New Resume
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && <ResumeListSkeleton />}

      {/* Empty State */}
      {!isLoading && resumes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No resumes yet
          </h3>
          <p className="text-gray-600 mb-6">
            Start building your first resume to get started
          </p>
          <Button
            as={Link}
            className="bg-adult-green text-white"
            color="success"
            href="/resume-builder/templates"
          >
            Create Your First Resume
          </Button>
        </div>
      )}

      {/* Resume Grid */}
      {!isLoading && resumes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => {
            const isDeleting = deletingId === resume.id;

            return (
              <Card
                key={resume.id}
                className="border border-gray-200 hover:shadow-lg transition-all"
                shadow="sm"
              >
                <CardBody className="p-6">
                  {/* Template Preview */}
                  <div className="aspect-[8.5/11] bg-white rounded-lg overflow-hidden relative border border-gray-200 mb-4">
                    <div
                      className="w-full h-full"
                      style={{
                        transform: "scale(0.6)",
                        transformOrigin: "top left",
                        width: "166.67%",
                        height: "166.67%",
                      }}
                    >
                      {getTemplateComponent(resume)}
                    </div>
                  </div>

                  {/* Resume Info */}
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg truncate">
                        {resume.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {resume.firstName} {resume.lastName}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full ${
                          resume.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : resume.status === "draft"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {resume.status.charAt(0).toUpperCase() +
                          resume.status.slice(1)}
                      </span>
                      <span>Updated {formatDate(resume.updatedAt)}</span>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        className="flex-1"
                        size="sm"
                        startContent={<Edit className="w-4 h-4" />}
                        variant="flat"
                        onPress={() => handleEdit(resume.id)}
                      >
                        Edit
                      </Button>
                      <Button
                        isIconOnly
                        color="success"
                        isLoading={exportingId === resume.id}
                        size="sm"
                        variant="flat"
                        onPress={() => handleExport(resume.id)}
                      >
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        isIconOnly
                        color="danger"
                        isLoading={isDeleting}
                        size="sm"
                        variant="flat"
                        onPress={() => handleDelete(resume.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
