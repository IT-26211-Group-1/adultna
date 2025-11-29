import { Suspense } from "react";
import GuidesListClient from "./_components/GuidesListClient";
import GuidesLoadingSkeleton from "./_components/GuidesLoadingSkeleton";
import GovGuidesHero from "./_components/GovGuidesHero";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

export default function GovernmentGuidesPage() {
  return (
    <div className="pt-4">
      {/* Top Bar with Language Switcher */}
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
