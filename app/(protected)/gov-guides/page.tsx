import { Suspense } from "react";
import GuidesListClient from "./_components/GuidesListClient";
import GuidesLoadingSkeleton from "./_components/GuidesLoadingSkeleton";
import GovGuidesHero from "./_components/GovGuidesHero";

export default function GovernmentGuidesPage() {
  return (
    <div className="pt-4">
      <GovGuidesHero />

      <div className="mx-4 sm:mx-6 lg:mx-8 py-8">
        <Suspense fallback={<GuidesLoadingSkeleton />}>
          <GuidesListClient />
        </Suspense>
      </div>
    </div>
  );
}
