"use client";

import dynamic from "next/dynamic";
import { FeatureText } from "./FeatureText";
import { FeatureNav } from "./FeatureNav";
import { FeatureSectionHeader } from "./FeatureSectionHeader";
import { FeaturesGrid } from "./FeaturesGrid";
import { ScrollUp } from "./ScrollUp";
import { HashNavigationHandler } from "./HashNavigationHandler";

const Roadmap = dynamic(
  () => import("./Roadmap").then((mod) => ({ default: mod.Roadmap })),
  {
    ssr: false,
    loading: () => (
      <div className="w-full bg-white h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-adult-green rounded-full animate-spin" />
        </div>
      </div>
    ),
  },
);

export function FeaturesContent() {
  return (
    <>
      <HashNavigationHandler />

      <div className="flex flex-col min-h-screen">
        <section className="w-full pt-8 sm:pt-12 md:pt-16 lg:pt-20">
          <FeatureText />
        </section>

        <section className="w-full" id="roadmap-section">
          <Roadmap />
        </section>

        <section className="flex flex-col items-center justify-center pt-4 sm:pt-5 pb-8 sm:pb-12">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16">
            <FeatureSectionHeader />
            <FeatureNav />
            <FeaturesGrid />
          </div>
        </section>

        <ScrollUp />
      </div>
    </>
  );
}
