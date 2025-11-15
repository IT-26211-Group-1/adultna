"use client";

import { useSearchParams } from "next/navigation";
import { CoverLetterPreview } from "../../_components/CoverLetterPreview";
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
import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { debounce } from "@/lib/utils/debounce";
import { Button } from "@heroui/react";

type SectionData = {
  intro?: CoverLetterSection;
  body?: CoverLetterSection;
  conclusion?: CoverLetterSection;
  signature?: CoverLetterSection;
};

export function CoverLetterEditorContainer() {
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("id") || "";

  const { data: coverLetter, isLoading: isCoverLetterLoading } =
    useCoverLetter(coverLetterId);
  const exportCoverLetter = useExportCoverLetter();
  const updateSections = useUpdateSections(coverLetterId);

  const [currentSectionType, setCurrentSectionType] = useState<SectionType>("intro");
  const [sectionData, setSectionData] = useState<SectionData>({});
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [title, setTitle] = useState(coverLetter?.title || "");
  const [loadedCoverLetterId, setLoadedCoverLetterId] = useState<string | null>(null);

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
    const isContentChanged = newDataString !== lastApiDataRef.current && lastApiDataRef.current !== "";

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
          lastSavedDataRef.current = { ...dataToSave };
          setIsSaving(false);
          resolve();
        },
        onError: (error) => {
          console.error("Failed to save sections:", error);
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

  const handleSectionChange = useCallback((sectionType: SectionType, content: string) => {
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
  }, []);

  // Create stable callbacks for each section
  const handleIntroChange = useCallback((content: string) => {
    handleSectionChange("intro", content);
  }, [handleSectionChange]);

  const handleBodyChange = useCallback((content: string) => {
    handleSectionChange("body", content);
  }, [handleSectionChange]);

  const handleConclusionChange = useCallback((content: string) => {
    handleSectionChange("conclusion", content);
  }, [handleSectionChange]);

  const handleSignatureChange = useCallback((content: string) => {
    handleSectionChange("signature", content);
  }, [handleSectionChange]);

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

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
  };

  const sortedSections =
    Object.values(sectionData)
      .filter((s): s is CoverLetterSection => !!s)
      .sort((a, b) => a.order - b.order) || [];

  // Section navigation
  const sectionOrder: SectionType[] = ["intro", "body", "conclusion", "signature"];
  const currentSectionIndex = sectionOrder.indexOf(currentSectionType);
  const isFirstSection = currentSectionIndex === 0;
  const isLastSection = currentSectionIndex === sectionOrder.length - 1;

  const handleNext = async () => {
    if (isLastSection) return;

    // Save before moving to next section
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch (error) {
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
      } catch (error) {
        // Don't navigate if save failed
        return;
      }
    }

    setCurrentSectionType(sectionOrder[currentSectionIndex - 1]);
  };

  const handleSectionTabClick = async (sectionType: SectionType) => {
    if (sectionType === currentSectionType) return;

    // Save before switching sections
    if (hasDataChanged()) {
      try {
        await handleSaveAllSections();
      } catch (error) {
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
        coverLetterId={coverLetterId}
        hasSaved={false}
        hasUnsavedChanges={hasUnsavedChanges}
        isExporting={exportCoverLetter.isPending}
        isSaving={isSaving}
        title={title}
        onExport={handleDownloadPDF}
        onTitleChange={handleTitleChange}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left: Form Editor */}
        <div className="w-1/2 border-r border-gray-200 overflow-y-auto p-8">
          <div className="space-y-6">
            {/* Section Selector */}
            <div className="flex gap-2 mb-8">
              {sectionOrder.map((sectionType) => (
                <button
                  key={sectionType}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    currentSectionType === sectionType
                      ? "bg-adult-green text-white hover:bg-[#0e4634]"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                  disabled={isSaving}
                  type="button"
                  onClick={() => handleSectionTabClick(sectionType)}
                >
                  {sectionType.charAt(0).toUpperCase() + sectionType.slice(1)}
                </button>
              ))}
            </div>

            {/* Form Component */}
            {currentSectionType === "intro" && (
              <IntroForm
                section={sectionData.intro}
                onSectionChange={handleIntroChange}
              />
            )}
            {currentSectionType === "body" && (
              <BodyForm
                section={sectionData.body}
                onSectionChange={handleBodyChange}
              />
            )}
            {currentSectionType === "conclusion" && (
              <ConclusionForm
                section={sectionData.conclusion}
                onSectionChange={handleConclusionChange}
              />
            )}
            {currentSectionType === "signature" && (
              <SignatureForm
                section={sectionData.signature}
                onSectionChange={handleSignatureChange}
              />
            )}

            {/* Navigation Buttons */}
            <div className="flex gap-3 justify-between pt-6">
              <Button
                disableAnimation
                isDisabled={isFirstSection || isSaving}
                isLoading={isSaving}
                size="lg"
                variant="bordered"
                onPress={handlePrevious}
              >
                {isSaving ? "Saving..." : "Previous"}
              </Button>
              <Button
                className="bg-adult-green hover:bg-[#0e4634] text-white"
                disableAnimation
                isDisabled={isLastSection || isSaving}
                isLoading={isSaving}
                size="lg"
                onPress={handleNext}
              >
                {isSaving ? "Saving..." : "Next"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Preview */}
        <div className="w-1/2 bg-gray-50 overflow-y-auto p-8">
          <div className="flex items-start justify-center">
            <div className="w-full max-w-[500px]">
              <CoverLetterPreview sections={sortedSections} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
