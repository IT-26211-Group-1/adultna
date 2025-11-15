"use client";

import { useSearchParams } from "next/navigation";
import { useCoverLetter } from "@/hooks/queries/useCoverLetterQueries";
import ReviewHeader from "./ReviewHeader";
import PreviewSection from "./PreviewSection";
import AIPanel from "./AIPanel";
import type { CoverLetterSection } from "@/types/cover-letter";

export default function ReviewContainer() {
  const searchParams = useSearchParams();
  const coverLetterId = searchParams.get("id") || "";
  const { data: coverLetter, isLoading } = useCoverLetter(coverLetterId);

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
      .sort((a: CoverLetterSection, b: CoverLetterSection) => a.order - b.order) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <ReviewHeader coverLetterId={coverLetterId} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <PreviewSection
            coverLetterId={coverLetterId}
            sections={sortedSections}
          />
          <AIPanel
            coverLetterId={coverLetterId}
            currentTone={coverLetter?.tone || "professional"}
          />
        </div>
      </div>
    </div>
  );
}
