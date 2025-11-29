"use client";

import { useState } from "react";
import React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import {
  useGovGuide,
  useTranslatedGuide,
} from "@/hooks/queries/useGovGuidesQueries";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, Tab } from "@heroui/tabs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import GuideInfoCards from "./GuideInfoCards";
import GuideDetailSkeleton from "./GuideDetailSkeleton";
import { DownloadPdfButton } from "./DownloadPdfButton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";

const CompleteGuideTab = dynamic(() => import("./CompleteGuideTab"), {
  loading: () => <div className="py-4">Loading...</div>,
});
const RequirementsTab = dynamic(() => import("./RequirementsTab"), {
  loading: () => <div className="py-4">Loading...</div>,
});
const GeneralTipsTab = dynamic(() => import("./GeneralTipsTab"), {
  loading: () => <div className="py-4">Loading...</div>,
});

type GuideDetailClientProps = {
  slug: string;
};

export default function GuideDetailClient({ slug }: GuideDetailClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const { guide, isLoading, error } = useGovGuide(slug);
  const { data: translatedGuide, isLoading: isTranslating } =
    useTranslatedGuide(slug, language);
  const [selectedTab, setSelectedTab] = useState("complete-guide");

  const displayGuide =
    language === "fil" && translatedGuide && guide
      ? ({ ...guide, ...translatedGuide } as typeof guide)
      : guide;

  if (isLoading || (language === "fil" && isTranslating)) {
    return <GuideDetailSkeleton />;
  }

  if (error || !guide) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
        <p className="text-red-800">
          {error
            ? "Failed to load guide. Please try again later."
            : "Guide not found."}
        </p>
        <Button
          disableAnimation
          className="mt-4 bg-adult-green text-white"
          onPress={() => router.push("/gov-guides")}
        >
          Back to Guides
        </Button>
      </div>
    );
  }

  return (
    <>
      {/* Breadcrumb Navigation */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center space-x-2 mb-6 text-sm text-gray-500"
      >
        <ol className="flex items-center space-x-2">
          <li>
            <Link
              className="hover:text-adult-green transition-colors"
              href="/gov-guides"
            >
              Government Guides
            </Link>
          </li>
          <li aria-hidden="true">
            <ChevronRight className="w-4 h-4" />
          </li>
          <li aria-current="page">
            <span className="text-gray-900 font-medium truncate">
              {displayGuide?.title}
            </span>
          </li>
        </ol>
      </nav>

      <hr className="border-gray-200 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
          {displayGuide?.title}
        </h1>
        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <DownloadPdfButton slug={slug} />
        </div>
      </div>

      {language === "fil" && isTranslating && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Translating to Filipino...</p>
        </div>
      )}

      <GuideInfoCards guide={guide} />

      <div
        aria-label="Guide content sections"
        className="mt-6 min-h-[600px]"
        role="region"
      >
        <Tabs
          disableAnimation
          aria-label="Guide sections"
          classNames={{
            base: "w-full bg-transparent",
            tabList: "w-full border-b border-gray-200 bg-transparent",
            tab: "px-0 py-1.5 pb-3 text-sm font-medium text-gray-500 hover:text-green-700 transition-all duration-200 ease-in-out bg-transparent data-[selected=true]:bg-transparent data-[selected=true]:border-b-2 data-[selected=true]:border-adult-green rounded-none border-b-2 border-transparent mb-[-2px]",
            cursor: "hidden",
            tabContent:
              "group-data-[selected=true]:text-adult-green group-data-[selected=true]:font-semibold",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="complete-guide" title="Complete Guide">
            <div className="py-4 min-h-[500px]" role="tabpanel">
              <CompleteGuideTab steps={displayGuide?.steps || []} />
            </div>
          </Tab>
          <Tab key="requirements" title="Requirements">
            <div className="py-4 min-h-[500px]" role="tabpanel">
              <RequirementsTab
                requirements={displayGuide?.requirements || []}
              />
            </div>
          </Tab>
          <Tab key="general-tips" title="General Tips">
            <div className="py-4 min-h-[500px]" role="tabpanel">
              <GeneralTipsTab tips={displayGuide?.generalTips} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
