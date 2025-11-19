"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useGovGuide } from "@/hooks/queries/useGovGuidesQueries";
import { Tabs, Tab } from "@heroui/tabs";
import { ArrowLeft } from "lucide-react";
import { Button } from "@heroui/button";
import GuideInfoCards from "./GuideInfoCards";
import CompleteGuideTab from "./CompleteGuideTab";
import RequirementsTab from "./RequirementsTab";
import GeneralTipsTab from "./GeneralTipsTab";
import OfficeMapModal from "./OfficeMapModal";
import GuideDetailSkeleton from "./GuideDetailSkeleton";

type GuideDetailClientProps = {
  slug: string;
};

export default function GuideDetailClient({ slug }: GuideDetailClientProps) {
  const router = useRouter();
  const { guide, isLoading, error } = useGovGuide(slug);
  const [selectedTab, setSelectedTab] = useState("complete-guide");
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);

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
      <Button
        disableAnimation
        className="mb-6 text-gray-600 hover:text-adult-green"
        startContent={<ArrowLeft className="w-4 h-4" />}
        variant="light"
        onPress={() => router.push("/gov-guides")}
      >
        Back
      </Button>

      <h1 className="text-3xl font-bold text-gray-900 mb-6">{guide.title}</h1>

      <GuideInfoCards guide={guide} onOpenMap={() => setIsMapModalOpen(true)} />

      <div className="mt-8">
        <Tabs
          disableAnimation
          classNames={{
            base: "w-full",
            tabList: "w-full border-b border-gray-200",
            tab: "px-6 py-3",
            cursor: "bg-adult-green",
            tabContent: "group-data-[selected=true]:text-adult-green",
          }}
          selectedKey={selectedTab}
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="complete-guide" title="Complete Guide">
            <div className="py-6">
              <CompleteGuideTab steps={guide.steps || []} />
            </div>
          </Tab>
          <Tab key="requirements" title="Requirements">
            <div className="py-6">
              <RequirementsTab requirements={guide.requirements || []} />
            </div>
          </Tab>
          <Tab key="general-tips" title="General Tips">
            <div className="py-6">
              <GeneralTipsTab tips={guide.generalTips} />
            </div>
          </Tab>
        </Tabs>
      </div>

      <OfficeMapModal
        isOpen={isMapModalOpen}
        office={guide.offices}
        onClose={() => setIsMapModalOpen(false)}
      />
    </>
  );
}
