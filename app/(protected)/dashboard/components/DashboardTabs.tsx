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
    <div className="flex justify-end space-x-2 mb-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          aria-current={activeTab === tab.id ? "page" : undefined}
          className={`px-6 py-3 rounded-full text-sm font-medium transition-all ${
            activeTab === tab.id
              ? "bg-adult-green text-white"
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
