"use client";

import {
  useResumes,
  useDeleteResume,
  useExportResume,
} from "@/hooks/queries/useResumeQueries";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import {
  FileText,
  Trash2,
  Edit,
  Plus,
  Download,
  Search,
  Clock,
} from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import ReverseChronologicalTemplate from "../templates/_components/ReverseChronologicalTemplate";
import ModernTemplate from "../templates/_components/ModernTemplate";
import SkillBasedTemplate from "../templates/_components/SkillBasedTemplate";
import HybridTemplate from "../templates/_components/HybridTemplate";

export function ResumeList() {
  const router = useRouter();
  const { data: resumesData = [], isLoading } = useResumes();
  const deleteResume = useDeleteResume();
  const exportResume = useExportResume();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [exportingId, setExportingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState<string>("");
  const [resumeToDelete, setResumeToDelete] = useState<string | null>(null);
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onOpenChange: onDeleteOpenChange,
  } = useDisclosure();

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Sort and filter resumes
  const resumes = useMemo(() => {
    let filtered = [...resumesData];

    // Filter by search query
    if (debouncedSearchQuery.trim()) {
      const query = debouncedSearchQuery.toLowerCase().trim();

      filtered = filtered.filter(
        (resume) =>
          resume.title.toLowerCase().includes(query) ||
          (resume.firstName &&
            resume.firstName.toLowerCase().includes(query)) ||
          (resume.lastName && resume.lastName.toLowerCase().includes(query)) ||
          resume.status.toLowerCase().includes(query),
      );
    }

    // Sort by most recent
    return filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();

      return dateB - dateA;
    });
  }, [resumesData, debouncedSearchQuery]);

  const resumeCount = resumes.length;

  const handleEdit = (resumeId: string) => {
    router.push(`/resume-builder/editor?resumeId=${resumeId}`);
  };

  const handleDelete = (resumeId: string) => {
    setResumeToDelete(resumeId);
    onDeleteOpen();
  };

  const handleDeleteConfirm = async () => {
    if (!resumeToDelete) return;

    setDeletingId(resumeToDelete);
    try {
      await deleteResume.mutateAsync(resumeToDelete);
    } finally {
      setDeletingId(null);
      setResumeToDelete(null);
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

  const getTimeAgo = (date: Date | string) => {
    const now = new Date();
    const past = new Date(date);
    const diffTime = Math.abs(now.getTime() - past.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? "s" : ""} ago`;

    return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? "s" : ""} ago`;
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

  const normalizeSkills = (skills: any) => {
    if (!Array.isArray(skills)) return [];

    return skills.map((skill) =>
      typeof skill === "string" ? { skill, proficiency: 0 } : skill,
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb and Tabs */}
      <div
        className="bg-transparent w-full"
        style={{
          minHeight: "auto",
          WebkitOverflowScrolling: "touch",
          touchAction: "pan-y",
          overflow: "visible",
        }}
      >
        <div className="w-full px-4 sm:px-6 lg:px-8 py-6">
          <div className="max-w-7xl mx-auto">
            {/* Breadcrumbs */}
            <div className="mb-3 sm:mb-3 sm:flex sm:items-center sm:justify-between">
              <Breadcrumb
                items={[
                  { label: "Dashboard", href: "/dashboard" },
                  { label: "Resume Builder", current: true },
                ]}
              />

              {/* Tabs - Only visible on sm+ screens */}
              <div className="hidden sm:flex gap-6">
                <Link
                  className="relative px-1 py-2 text-sm font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  href="/resume-builder?tab=create"
                >
                  Create
                </Link>
                <span className="relative px-1 py-2 text-sm font-medium transition-all duration-300 text-emerald-600 whitespace-nowrap">
                  <span className="flex items-center gap-2">My Resumes</span>
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
                </span>
                <Link
                  className="relative px-1 py-2 text-sm font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                  href="/resume-builder?tab=grade"
                >
                  Grade Resume
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs - Closer to content on small screens */}
        <div className="sm:hidden px-4 py-2">
          <div className="max-w-7xl mx-auto">
            <div className="flex gap-3 overflow-x-auto pb-1 justify-center">
              <Link
                className="relative px-2 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                href="/resume-builder?tab=create"
              >
                Create
              </Link>
              <span className="relative px-2 py-2 text-xs font-medium transition-all duration-300 text-emerald-600 whitespace-nowrap">
                <span className="flex items-center gap-1">My Resumes</span>
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600" />
              </span>
              <Link
                className="relative px-2 py-2 text-xs font-medium transition-all duration-300 text-gray-600 hover:text-gray-900 whitespace-nowrap"
                href="/resume-builder?tab=grade"
              >
                Grade Resume
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="space-y-6 animate-[fadeIn_0.4s_ease-out]">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
                My Resumes
              </h1>
              <p className="text-xs text-gray-500 mt-1">
                {resumeCount} resume{resumeCount !== 1 ? "s" : ""} in your
                collection
              </p>
            </div>
            <Link href="/resume-builder/templates">
              <button className="bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md w-full sm:w-auto">
                <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="sm:hidden">Create Resume</span>
                <span className="hidden sm:inline">Create New Resume</span>
              </button>
            </Link>
          </div>

          {/* Search */}
          <div className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                className="w-full pl-9 pr-3 py-2 text-sm border-0 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all duration-200"
                placeholder="Search resumes..."
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Loading State */}
          {isLoading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse"
                >
                  <div className="bg-gray-200 h-24 sm:h-28" />
                  <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
                    <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-2 sm:h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {!isLoading && resumes.length === 0 && (
            <div className="text-center py-8 sm:py-12">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-gray-300 mx-auto mb-3 sm:mb-4" />
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">
                No resumes yet
              </h3>
              <p className="text-xs sm:text-sm text-gray-500 mb-4 sm:mb-6 px-4">
                Start building your first resume to get started
              </p>
              <Link href="/resume-builder/templates">
                <button className="bg-emerald-600 text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-xs sm:text-sm font-medium hover:bg-emerald-700 transition-all duration-200 shadow-sm hover:shadow-md">
                  Create Your First Resume
                </button>
              </Link>
            </div>
          )}

          {/* Resume Grid */}
          {!isLoading && resumes.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {resumes.map((resume, index) => {
                const isDeleting = deletingId === resume.id;
                const isExporting = exportingId === resume.id;

                return (
                  <div
                    key={resume.id}
                    className="bg-white rounded-lg border border-gray-200 hover:border-emerald-400 hover:shadow-md transition-all duration-300 overflow-hidden group flex flex-col"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="h-48 sm:h-56 md:h-64 bg-white rounded-t-lg overflow-hidden relative border-b border-gray-200 transition-all duration-300 group-hover:border-emerald-200">
                      <div
                        className="w-full h-full bg-white"
                        style={{
                          transform: "scale(0.25)",
                          transformOrigin: "top left",
                          width: "400%",
                          height: "400%",
                        }}
                      >
                        {getTemplateComponent(resume)}
                      </div>
                    </div>
                    <div className="p-3 sm:p-4 flex flex-col flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors duration-200 line-clamp-2">
                            {resume.title}
                          </h3>
                          {resume.firstName && resume.lastName && (
                            <p className="text-xs text-gray-500 mt-1">
                              {resume.firstName} {resume.lastName}
                            </p>
                          )}
                        </div>
                        <span
                          className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ml-2 ${
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
                      <p className="text-xs text-gray-500 flex items-center mb-2 sm:mb-3">
                        <Clock className="w-3 h-3 mr-1" />
                        {getTimeAgo(resume.updatedAt)}
                      </p>

                      {/* Action Buttons - Push to bottom */}
                      <div className="flex gap-1.5 sm:gap-2 mt-auto">
                        <button
                          className="flex-1 flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 text-xs font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-md transition-colors duration-200"
                          onClick={() => handleEdit(resume.id)}
                        >
                          <Edit className="w-3 h-3" />
                          <span className="hidden sm:inline">Edit</span>
                        </button>
                        <button
                          className="flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                          disabled={isExporting}
                          title="Export Resume"
                          onClick={() => handleExport(resume.id)}
                        >
                          <Download className="w-3 h-3" />
                        </button>
                        <button
                          className="flex items-center justify-center px-1.5 sm:px-2 py-1.5 sm:py-2 text-xs font-medium text-red-700 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 disabled:opacity-50"
                          disabled={isDeleting}
                          title="Delete Resume"
                          onClick={() => handleDelete(resume.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onOpenChange={onDeleteOpenChange}>
        <ModalContent>
          {(onClose) => {
            const resumeToDeleteData = resumes.find(
              (r) => r.id === resumeToDelete,
            );

            return (
              <>
                <ModalHeader className="flex flex-col gap-1">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-100 rounded-full">
                      <Trash2 className="w-5 h-5 text-red-600" />
                    </div>
                    <span>Delete Resume</span>
                  </div>
                </ModalHeader>
                <ModalBody>
                  <div className="space-y-3">
                    <p>
                      Are you sure you want to delete{" "}
                      <strong>"{resumeToDeleteData?.title}"</strong>?
                    </p>
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-800">
                        <strong>This action cannot be undone.</strong> The
                        resume will be permanently removed from your account.
                      </p>
                    </div>
                    {resumeToDeleteData && (
                      <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="font-medium">Status:</span>{" "}
                            <span
                              className={`capitalize ${
                                resumeToDeleteData.status === "completed"
                                  ? "text-emerald-600"
                                  : resumeToDeleteData.status === "draft"
                                    ? "text-amber-600"
                                    : "text-gray-600"
                              }`}
                            >
                              {resumeToDeleteData.status}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">Last updated:</span>{" "}
                            {getTimeAgo(resumeToDeleteData.updatedAt)}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="default" variant="light" onPress={onClose}>
                    Cancel
                  </Button>
                  <Button
                    color="danger"
                    isLoading={deletingId === resumeToDelete}
                    onPress={async () => {
                      await handleDeleteConfirm();
                      onClose();
                    }}
                  >
                    {deletingId === resumeToDelete
                      ? "Deleting..."
                      : "Delete Resume"}
                  </Button>
                </ModalFooter>
              </>
            );
          }}
        </ModalContent>
      </Modal>

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
