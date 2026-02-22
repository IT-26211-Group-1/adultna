"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import GuidesListClient from "./GuidesListClient";
import GuideDetailClient from "./GuideDetailClient";
import GuidesLoadingSkeleton from "./GuidesLoadingSkeleton";
import GovGuidesHero from "./GovGuidesHero";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function GovGuidesPageClient() {
  const searchParams = useSearchParams();
  const guideName = searchParams.get("guide");

  if (guideName) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <GuideDetailClient slug={guideName} />
      </div>
    );
  }

  return (
    <div className="pt-4">
      <div className="mx-4 sm:mx-6 lg:mx-8 mb-4">
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>
      </div>

      <GovGuidesHero />

      <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
        <Suspense fallback={<GuidesLoadingSkeleton />}>
          <GuidesListClient />
        </Suspense>
      </div>
    </div>
  );
}
