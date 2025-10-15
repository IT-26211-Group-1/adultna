"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardCards from "./DashboardCards";
import ProfileSidebar from "./ProfileSidebar";

interface DashboardContentProps {
  sidebarCollapsed: boolean;
}

export default function DashboardContent({
  sidebarCollapsed,
}: DashboardContentProps) {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`flex gap-8 p-6 transition-all duration-300 ${sidebarCollapsed ? "ml-8" : "ml-1"} ${isModalOpen ? "blur-sm" : ""}`}
    >
      {/* Left Content Area */}
      <div className="flex flex-1 flex-col lg:h-[calc(100vh-3rem)]">
        {/* Header */}
        <DashboardHeader />

        {/* Category Tabs */}
        <DashboardTabs activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Dashboard Cards */}
        <DashboardCards activeTab={activeTab} />
      </div>

      {/* Profile Sidebar */}
      <ProfileSidebar
        sidebarCollapsed={sidebarCollapsed}
        onModalStateChange={setIsModalOpen}
      />
    </div>
  );
}
