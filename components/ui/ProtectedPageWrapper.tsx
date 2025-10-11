"use client";

import React, { useState } from "react";
import UserSidebar from "./sidebar/UserSidebar";

interface ProtectedPageWrapperProps {
  children:
    | React.ReactNode
    | ((props: { sidebarCollapsed: boolean }) => React.ReactNode);
  isModalOpen?: boolean;
}

export default function ProtectedPageWrapper({
  children,
  isModalOpen,
}: ProtectedPageWrapperProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: "white",
      }}
    >
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isModalOpen ? "blur-sm" : ""}`}
      >
        <UserSidebar
          isCollapsed={sidebarCollapsed}
          isOpen={sidebarOpen}
          onCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
      </div>

      {/* Main Content Wrapper */}
      <div
        className={`transition-all duration-300 ${sidebarCollapsed ? "lg:ml-20" : "lg:ml-72"} relative z-10`}
      >
        {typeof children === "function"
          ? children({ sidebarCollapsed })
          : children}
      </div>
    </div>
  );
}
