"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useCoverLetter, useExportCoverLetter, useSaveToFilebox } from "@/hooks/queries/useCoverLetterQueries";
import { CoverLetterPreview } from "../../_components/CoverLetterPreview";
import { addToast } from "@heroui/toast";
import { Download, Copy, Save, FileText } from "lucide-react";
import type { CoverLetterSection } from "@/types/cover-letter";

export default function ReviewContainer() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("id") || "";
  const { data: coverLetter, isLoading } = useCoverLetter(coverLetterId);
  const exportCoverLetter = useExportCoverLetter();
  const saveToFilebox = useSaveToFilebox(coverLetterId);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  const sortedSections =
    coverLetter?.sections
      ?.filter((s: CoverLetterSection | null): s is CoverLetterSection => !!s)
      .sort(
        (a: CoverLetterSection, b: CoverLetterSection) => a.order - b.order,
      ) || [];

  const handleCopyText = async () => {
    const fullText = sortedSections.map((section: CoverLetterSection) => section.content).join("\n\n");
    try {
      await navigator.clipboard.writeText(fullText);
      addToast({ title: "Copied to clipboard!", color: "success" });
    } catch {
      addToast({ title: "Failed to copy", color: "danger" });
    }
  };

  const handleDownloadPDF = async () => {
    try {
      await exportCoverLetter.mutateAsync(coverLetterId);
      addToast({ title: "PDF downloaded successfully!", color: "success" });
    } catch {
      addToast({ title: "Failed to download PDF", color: "danger" });
    }
  };

  const handleSaveToFilebox = async () => {
    try {
      await saveToFilebox.mutateAsync();
      addToast({
        title: "Saved to Filebox!",
        description: "Your cover letter has been saved",
        color: "success",
      });
    } catch {
      addToast({ title: "Failed to save to Filebox", color: "danger" });
    }
  };

  const handleEditCoverLetter = () => {
    router.push(`/cover-letter/editor?id=${coverLetterId}`);
  };

  const handleCreateNewCoverLetter = () => {
    router.push("/cover-letter");
  };

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <div className="flex-1 bg-white p-8 overflow-y-auto">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-sm font-medium mb-5 mt-4">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Cover Letter Complete
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 leading-tight">
              <span className="text-emerald-600">Your Cover Letter is Ready!</span>
            </h1>
            <p className="text-sm text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Your cover letter perfectly complements your resume and is ready to make a great first impression. You&apos;re one step closer to landing your dream job!
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left: Cover Letter Preview */}
            <div>
              <div className="bg-gray-50 rounded-2xl p-6 h-[80vh] overflow-hidden">
                <CoverLetterPreview sections={sortedSections} />
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-start justify-center lg:pt-12">
              <div className="w-full max-w-md space-y-8">
                {/* Action Buttons */}
                <div className="flex flex-col items-center gap-4">
                  <button
                    className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-sm disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    onClick={handleDownloadPDF}
                    disabled={exportCoverLetter.isPending}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {exportCoverLetter.isPending ? (
                        "Preparing PDF..."
                      ) : (
                        <>
                          <Download className="h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    className="w-full px-4 py-2 border-2 border-emerald-600 text-emerald-600 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-600 hover:text-white hover:shadow-sm text-sm"
                    onClick={handleEditCoverLetter}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-4 w-4" />
                      Edit Cover Letter
                    </div>
                  </button>

                  <button
                    className="w-full px-4 py-2 bg-emerald-100 text-emerald-600 rounded-lg font-medium transition-all duration-200 hover:bg-emerald-200 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                    onClick={handleSaveToFilebox}
                    disabled={saveToFilebox.isPending}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {saveToFilebox.isPending ? (
                        "Saving..."
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save to Filebox
                        </>
                      )}
                    </div>
                  </button>

                  <button
                    className="w-full px-4 py-2 border border-gray-300 text-gray-600 rounded-lg font-medium transition-all duration-200 hover:bg-gray-50 text-sm"
                    onClick={handleCopyText}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <Copy className="h-4 w-4" />
                      Copy Text
                    </div>
                  </button>

                  <button
                    className="px-4 py-2 bg-transparent text-gray-600 rounded-lg font-medium transition-all duration-200 hover:text-gray-800 hover:bg-gray-50 text-sm"
                    onClick={handleCreateNewCoverLetter}
                  >
                    Create New Cover Letter
                  </button>
                </div>

                {/* Next Steps Section */}
                <div className="border rounded-lg p-4" style={{borderColor: '#FCE2A9', backgroundColor: '#FEF3D9'}}>
                  <div className="mb-3">
                    <h3 className="text-small font-semibold mb-1" style={{color: '#D4A574'}}>
                      Ready to Apply with Confidence?
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      You now have both a polished resume and cover letter. Time to start applying to your dream jobs!
                    </p>
                  </div>
                  <button
                    className="w-full px-4 py-2 text-white rounded-lg font-medium transition-all duration-200 text-sm"
                    style={{backgroundColor: '#D4A574'}}
                    onClick={() => router.push("/jobs")}
                  >
                    Browse Job Board
                  </button>
                </div>

                {/* Encouragement Note */}
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500 italic">
                    "The perfect combination of resume and cover letter opens doors. Go get them!"
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
