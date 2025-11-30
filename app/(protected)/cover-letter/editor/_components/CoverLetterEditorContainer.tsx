"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CoverLetterPreview } from "../../_components/CoverLetterPreview";
import { logger } from "@/lib/logger";
import {
  useCoverLetter,
  useUpdateSections,
  useExportCoverLetter,
} from "@/hooks/queries/useCoverLetterQueries";
import { addToast } from "@heroui/toast";
import type { CoverLetterSection, SectionType } from "@/types/cover-letter";
import { GeneratingCoverLetterLoader } from "../../_components/LoadingSkeleton";
import EditorHeader from "./EditorHeader";
import IntroForm from "./forms/IntroForm";
import BodyForm from "./forms/BodyForm";
import ConclusionForm from "./forms/ConclusionForm";
import SignatureForm from "./forms/SignatureForm";
import { useState, useEffect, useRef, useCallback } from "react";
import React from "react";

type SectionData = {
  intro?: CoverLetterSection;
  body?: CoverLetterSection;
  conclusion?: CoverLetterSection;
  signature?: CoverLetterSection;
};

export function CoverLetterEditorContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const coverLetterId = searchParams.get("id") || "";

  const { data: coverLetter, isLoading: isCoverLetterLoading } =
    useCoverLetter(coverLetterId);
  const exportCoverLetter = useExportCoverLetter();
  const updateSections = useUpdateSections(coverLetterId);

  const [currentSectionType, setCurrentSectionType] =
    useState<SectionType>("intro");
  const [sectionData, setSectionData] = useState<SectionData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [hasSaved, setHasSaved] = useState(false);
  const [title, setTitle] = useState(coverLetter?.title || "");
  const [loadedCoverLetterId, setLoadedCoverLetterId] = useState<string | null>(
    null,
  );

  const lastSavedDataRef = useRef<SectionData>({});
  const lastApiDataRef = useRef<string>("");

  // Initialize data from API when loading a different cover letter or when content changes (like generation)
  useEffect(() => {
    if (!coverLetter) return;

    const newSections: SectionData = {};

    coverLetter.sections?.forEach((section: CoverLetterSection) => {
      newSections[section.sectionType as keyof SectionData] = section;
    });

    const newDataString = JSON.stringify(newSections);
    const isNewCoverLetter = coverLetter.id !== loadedCoverLetterId;
    const isContentChanged =
      newDataString !== lastApiDataRef.current && lastApiDataRef.current !== "";

    // Update if it's a new cover letter OR if the API content has changed (generation)
    if (isNewCoverLetter) {
      // Always update for new cover letter
      setSectionData(newSections);
      lastSavedDataRef.current = newSections;
      lastApiDataRef.current = newDataString;
      setTitle(coverLetter.title || "");
      setLoadedCoverLetterId(coverLetter.id);
    } else if (isContentChanged) {
      setSectionData(newSections);
      lastSavedDataRef.current = newSections;
      lastApiDataRef.current = newDataString;
    } else if (!lastApiDataRef.current) {
      // Initial load
      setSectionData(newSections);
      lastSavedDataRef.current = newSections;
      lastApiDataRef.current = newDataString;
      setTitle(coverLetter.title || "");
      setLoadedCoverLetterId(coverLetter.id);
    }
  }, [coverLetter, loadedCoverLetterId]);

  // Check if data has changed
  const hasDataChanged = useCallback(() => {
    return (
      JSON.stringify(sectionData) !== JSON.stringify(lastSavedDataRef.current)
    );
  }, [sectionData]);

  // Save sections (called when clicking Next)
  const handleSaveAllSections = useCallback(async () => {
    if (!hasDataChanged() || isSaving) return;

    // Capture the current section data at the time of mutation
    const dataToSave = { ...sectionData };
    const sectionsToUpdate = Object.values(dataToSave)
      .filter((section): section is CoverLetterSection => section != null)
      .map((section) => ({
        sectionType: section.sectionType,
        content: section.content,
      }));

    if (sectionsToUpdate.length === 0) {
      return;
    }

    setIsSaving(true);

    return new Promise<void>((resolve, reject) => {
      updateSections.mutate(sectionsToUpdate, {
        onSuccess: () => {
          setHasUnsavedChanges(false);
          setHasSaved(true);
          lastSavedDataRef.current = { ...dataToSave };
          setIsSaving(false);

          // Reset hasSaved after 3 seconds
          setTimeout(() => {
            setHasSaved(false);
          }, 3000);

          resolve();
        },
        onError: (error) => {
          logger.error("Failed to save sections:", error);
          setIsSaving(false);
          addToast({
            title: "Failed to save changes",
            color: "danger",
          });
          reject(error);
        },
      });
    });
  }, [hasDataChanged, isSaving, sectionData, updateSections]);

  // Track unsaved changes
  useEffect(() => {
    if (hasDataChanged()) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  }, [sectionData, hasDataChanged]);

  // Browser beforeunload warning
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();

        return "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [hasUnsavedChanges]);

  const handleTitleChange = useCallback((newTitle: string) => {
    setTitle(newTitle);
  }, []);

  const handleSectionChange = useCallback(
    (sectionType: SectionType, content: string) => {
      setSectionData((prev) => {
        const section = prev[sectionType];

        if (!section) return prev;

        return {
          ...prev,
          [sectionType]: {
            ...section,
            content,
          },
        };
      });
    },
    [],
  );

  // Create stable callbacks for each section
  const handleIntroChange = useCallback(
    (content: string) => {
      handleSectionChange("intro", content);
    },
    [handleSectionChange],
  );

  const handleBodyChange = useCallback(
    (content: string) => {
      handleSectionChange("body", content);
    },
    [handleSectionChange],
  );

  const handleConclusionChange = useCallback(
    (content: string) => {
      handleSectionChange("conclusion", content);
    },
    [handleSectionChange],
  );

  const handleSignatureChange = useCallback(
    (content: string) => {
      handleSectionChange("signature", content);
    },
    [handleSectionChange],
  );

  const handleDownloadPDF = async () => {
    try {
      await exportCoverLetter.mutateAsync(coverLetterId);
      addToast({
        title: "PDF downloaded successfully!",
        color: "success",
      });
    } catch {
      addToast({
        title: "Failed to download PDF",
        color: "danger",
      });
    }
  };


  const sortedSections =
    Object.values(sectionData)
      .filter((s): s is CoverLetterSection => !!s)
      .sort((a, b) => a.order - b.order) || [];

  // Section navigation
  const sectionOrder: SectionType[] = [
    "intro",
    "body",
    "conclusion",
    "signature",
  ];
  const currentSectionIndex = sectionOrder.indexOf(currentSectionType);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sectionOrder.length - 1;

  const handleNext = async () => {
    if (isLastSection) return;

    // Save before moving to next section
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch {
        // Don't navigate if save failed
        return;
      }
    }

    setCurrentSectionType(sectionOrder[currentSectionIndex + 1]);
  };

  const handlePrevious = async () => {
    if (isFirstSection) return;

    // Save before moving to previous section
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch {
        // Don't navigate if save failed
        return;
      }
    }

    setCurrentSectionType(sectionOrder[currentSectionIndex - 1]);
  };

  const handleFinish = async () => {
    // Save before redirecting to review page
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch {
        // Don't navigate if save failed
        return;
      }
    }

    // Navigate to review page
    router.push(`/cover-letter/review?id=${coverLetterId}`);
  };

  const handleSectionTabClick = async (sectionType: SectionType) => {
    if (sectionType === currentSectionType) return;

    // Save before switching sections
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch {
        // Don't navigate if save failed
        return;
      }
    }

    setCurrentSectionType(sectionType);
  };

  if (isCoverLetterLoading) {
    return (
      <div className="h-dvh bg-gray-50 p-4 overflow-hidden">
        <div className="flex items-center justify-center h-full">
          <GeneratingCoverLetterLoader />
        </div>
      </div>
    );
  }


  return (
    <div className="h-dvh bg-white flex flex-col overflow-hidden">
      <EditorHeader
        hasSaved={hasSaved}
        hasUnsavedChanges={hasUnsavedChanges}
        isExporting={exportCoverLetter.isPending}
        isSaving={isSaving}
        title={title}
        onExport={handleDownloadPDF}
        coverLetterId={coverLetterId}
        onTitleChange={handleTitleChange}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form Editor */}
        <div className="w-1/2 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Section Selector - Responsive Progress Stepper */}
            <div className="mb-8">
              {/* Mobile Design (< 640px) */}
              <div className="sm:hidden">
                <div className="ml-auto mr-8 max-w-xl">
                  <div className="text-center mb-4">
                    <div className="text-sm font-medium text-gray-600 mb-1">
                      Step {currentSectionIndex + 1} of {sectionOrder.length}
                    </div>
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={handlePrevious}
                        disabled={isFirstSection || isSaving}
                        className={`p-1 rounded transition-colors ${
                          !isFirstSection && !isSaving
                            ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        aria-label="Previous step"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <div className="text-lg font-semibold text-emerald-700 px-2">
                        {currentSectionType.charAt(0).toUpperCase() + currentSectionType.slice(1)}
                      </div>
                      <button
                        onClick={handleNext}
                        disabled={isLastSection || isSaving}
                        className={`p-1 rounded transition-colors ${
                          !isLastSection && !isSaving
                            ? "text-emerald-700 hover:text-emerald-800 hover:bg-emerald-50"
                            : "text-gray-300 cursor-not-allowed"
                        }`}
                        aria-label="Next step"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  {/* Linear Progress Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${((currentSectionIndex + 1) / sectionOrder.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Desktop Design (≥ 640px) */}
              <div className="hidden sm:block ml-auto mr-8 max-w-xl">
                <div className="flex items-center justify-center">
                  {sectionOrder.map((sectionType, index) => {
                    const isActive = currentSectionType === sectionType;
                    const isCompleted = sectionOrder.indexOf(currentSectionType) > index;

                    return (
                      <React.Fragment key={sectionType}>
                        {/* Step Container with Fixed Width */}
                        <div className="flex flex-col items-center w-20">
                          {/* Step Circle */}
                          <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200 mb-2 ${
                              isActive || isCompleted
                                ? "bg-emerald-600 text-white shadow-md"
                                : "bg-gray-200 text-gray-400 hover:bg-gray-300"
                            }`}
                            disabled={isSaving}
                            type="button"
                            onClick={() => handleSectionTabClick(sectionType)}
                            aria-label={`Go to step ${index + 1}: ${sectionType}`}
                          >
                            {index + 1}
                          </button>

                          {/* Step Label */}
                          <button
                            className={`text-xs text-center leading-tight transition-colors w-full ${
                              isActive
                                ? "text-emerald-700 font-medium"
                                : "text-gray-500 hover:text-gray-700"
                            }`}
                            disabled={isSaving}
                            type="button"
                            onClick={() => handleSectionTabClick(sectionType)}
                            aria-label={`Go to step ${index + 1}: ${sectionType}`}
                          >
                            {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
                          </button>
                        </div>

                        {/* Connector Line */}
                        {index < sectionOrder.length - 1 && (
                          <div
                            className={`h-0.5 w-8 transition-all duration-200 ${
                              index < currentSectionIndex ? "bg-emerald-600" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Form Component */}
            {currentSectionType === "intro" && (
              <IntroForm
                section={sectionData.intro}
                onSectionChange={handleIntroChange}
                onNext={handleNext}
                isLoading={isSaving}
              />
            )}
            {currentSectionType === "body" && (
              <BodyForm
                section={sectionData.body}
                onSectionChange={handleBodyChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLoading={isSaving}
              />
            )}
            {currentSectionType === "conclusion" && (
              <ConclusionForm
                section={sectionData.conclusion}
                onSectionChange={handleConclusionChange}
                onNext={handleNext}
                onPrevious={handlePrevious}
                isLoading={isSaving}
              />
            )}
            {currentSectionType === "signature" && (
              <SignatureForm
                section={sectionData.signature}
                onSectionChange={handleSignatureChange}
                onFinish={handleFinish}
                onPrevious={handlePrevious}
                isLoading={isSaving}
              />
            )}

          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 overflow-y-auto">
          <CoverLetterPreview sections={sortedSections} className="w-full" />
        </div>
      </div>
    </div>
  );
}
