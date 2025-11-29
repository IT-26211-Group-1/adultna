"use client";

import { memo, useCallback } from "react";

interface Tab {
  id: string;
  label: string;
}

interface DashboardTabsProps {
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

const tabs: Tab[] = [
  { id: "all", label: "All" },
  { id: "roadmap", label: "Adulting Roadmap Progress" },
  { id: "activities", label: "Recent Activities" },
  { id: "deadlines", label: "Upcoming Deadlines" },
];

function DashboardTabs({ activeTab, onTabChange }: DashboardTabsProps) {
  const handleTabClick = useCallback(
    (tabId: string) => {
      onTabChange(tabId);
    },
    [onTabChange],
  );

  return (
    <div className="flex flex-wrap justify-center sm:justify-end gap-2 sm:gap-3 mb-6 sm:mb-8 lg:mb-8 overflow-x-auto">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-full text-xs sm:text-sm font-medium transition-all whitespace-nowrap min-h-[44px] flex items-center ${
            activeTab === tab.id
              ? "bg-adult-green text-white shadow-md"
              : "bg-adult-green/10 backdrop-blur-sm text-gray-600 hover:bg-adult-green/20"
          }`}
          onClick={() => handleTabClick(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default memo(DashboardTabs);
