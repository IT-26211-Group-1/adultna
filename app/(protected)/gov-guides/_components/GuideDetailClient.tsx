"use client";

import { useState } from "react";
import React from "react";
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
import CompleteGuideTab from "./CompleteGuideTab";
import RequirementsTab from "./RequirementsTab";
import GeneralTipsTab from "./GeneralTipsTab";
import GuideDetailSkeleton from "./GuideDetailSkeleton";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { DownloadPdfButton } from "./DownloadPdfButton";

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

  // Merge translated content with original guide data
  const displayGuide =
    language === "fil" && translatedGuide && guide
      ? {
          ...guide,
          title: translatedGuide.title,
          summary: translatedGuide.description,
          steps: guide.steps?.map((step) => {
            const translatedStep = translatedGuide.steps?.find(
              (s) => s.stepNumber === step.stepNumber
            );
            return translatedStep ? { ...step, ...translatedStep } : step;
          }),
          requirements: guide.requirements?.map((req, index) => {
            const translatedReq = translatedGuide.requirements?.[index];
            return translatedReq ? { ...req, ...translatedReq } : req;
          }),
          generalTips: translatedGuide.generalTips || guide.generalTips,
        }
      : guide;

  if (isLoading || (language === "fil" && isTranslating)) {
    return <GuideDetailSkeleton />;
  }

  if (error || !guide || !displayGuide) {
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
      {/* Breadcrumb Navigation with Language Switcher */}
      <div className="flex items-center justify-between mb-6">
        <nav className="flex items-center space-x-2 text-sm text-gray-500">
          <Link
            className="hover:text-adult-green transition-colors"
            href="/gov-guides"
          >
            Government Guides
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-gray-900 font-medium truncate">
            {displayGuide?.title}
          </span>
        </nav>
        <LanguageSwitcher />
      </div>

      <hr className="border-gray-200 mb-6" />

      <div className="flex items-center justify-between mb-4">
        <h1 className="text-3xl font-semibold text-gray-900 tracking-tight leading-tight">
          {displayGuide?.title}
        </h1>
        <DownloadPdfButton slug={slug} />
      </div>

      {language === "fil" && isTranslating && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">Translating to Filipino...</p>
        </div>
      )}

      <GuideInfoCards guide={displayGuide} />

      <div className="mt-6">
        <Tabs
          disableAnimation
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
            <div className="py-4">
              <CompleteGuideTab steps={displayGuide?.steps || []} />
            </div>
          </Tab>
          <Tab key="requirements" title="Requirements">
            <div className="py-4">
              <RequirementsTab
                requirements={displayGuide?.requirements || []}
              />
            </div>
          </Tab>
          <Tab key="general-tips" title="General Tips">
            <div className="py-4">
              <GeneralTipsTab tips={displayGuide?.generalTips} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
