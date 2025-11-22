"use client";

import { useState } from "react";
import React from "react";
import { useRouter } from "next/navigation";
import { useGovGuide } from "@/hooks/queries/useGovGuidesQueries";
import { Tabs, Tab } from "@heroui/tabs";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@heroui/button";
import GuideInfoCards from "./GuideInfoCards";
import CompleteGuideTab from "./CompleteGuideTab";
import RequirementsTab from "./RequirementsTab";
import GeneralTipsTab from "./GeneralTipsTab";
import GuideDetailSkeleton from "./GuideDetailSkeleton";

type GuideDetailClientProps = {
  slug: string;
};

export default function GuideDetailClient({ slug }: GuideDetailClientProps) {
  const router = useRouter();
  const { guide, isLoading, error } = useGovGuide(slug);
  const [selectedTab, setSelectedTab] = useState("complete-guide");

  if (isLoading) {
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
      <nav className="flex items-center space-x-2 mb-6 text-sm text-gray-500">
        <Link
          className="hover:text-adult-green transition-colors"
          href="/gov-guides"
        >
          Government Guides
        </Link>
        <ChevronRight className="w-4 h-4" />
        <span className="text-gray-900 font-medium truncate">
          {guide.title}
        </span>
      </nav>

      <hr className="border-gray-200 mb-6" />

      <h1 className="text-3xl font-semibold text-gray-900 mb-8 tracking-tight leading-tight">
        {guide.title}
      </h1>

      <GuideInfoCards guide={guide} />

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
              <CompleteGuideTab steps={guide.steps || []} />
            </div>
          </Tab>
          <Tab key="requirements" title="Requirements">
            <div className="py-4">
              <RequirementsTab requirements={guide.requirements || []} />
            </div>
          </Tab>
          <Tab key="general-tips" title="General Tips">
            <div className="py-4">
              <GeneralTipsTab tips={guide.generalTips} />
            </div>
          </Tab>
        </Tabs>
      </div>
    </>
  );
}
