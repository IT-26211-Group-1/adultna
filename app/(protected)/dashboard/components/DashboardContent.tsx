"use client";

import React, { useState } from "react";
import DashboardHeader from "./DashboardHeader";
import DashboardTabs from "./DashboardTabs";
import DashboardCards from "./DashboardCards";
import ProfileSidebar from "./ProfileSidebar";

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div
      className={`flex gap-8 p-6 transition-all duration-300 ${isModalOpen ? "blur-sm" : ""}`}
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
      <ProfileSidebar onModalStateChange={setIsModalOpen} />
    </div>
  );
}
