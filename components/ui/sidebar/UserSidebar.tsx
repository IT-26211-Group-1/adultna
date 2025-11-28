"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarCollapsibleSection from "./SidebarCollapsibleSection";
import SidebarStorage from "./SidebarStorage";
import SidebarUserProfile from "./SidebarUserProfile";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
  children?:
    | React.ReactNode
    | ((props: { sidebarCollapsed: boolean }) => React.ReactNode);
  isModalOpen?: boolean;
  backgroundColor?: string;
}

function UserSidebar({
  isOpen: controlledIsOpen,
  onToggle,
  isCollapsed: controlledIsCollapsed,
  onCollapse,
  children,
  isModalOpen,
  backgroundColor,
}: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const pathname = usePathname();

  // Apply specific backgrounds for certain pages
  const resolvedBackgroundColor =
    backgroundColor ||
    (pathname === "/roadmap"
      ? "rgba(154,205,50, 0.08)"
      : pathname === "/find-office"
        ? "white"
        : "white");

  // Use controlled state if provided, otherwise use internal state
  const isOpen =
    controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const isCollapsed =
    controlledIsCollapsed !== undefined
      ? controlledIsCollapsed
      : internalIsCollapsed;

  const handleToggle = useMemo(
    () => onToggle || (() => setInternalIsOpen((prev) => !prev)),
    [onToggle],
  );

  const handleCollapse = useMemo(
    () => onCollapse || (() => setInternalIsCollapsed((prev) => !prev)),
    [onCollapse],
  );

  const toggleSection = useCallback(
    (sectionId: string) => {
      if (isCollapsed) return; // Don't allow expansion when collapsed
      setExpandedSections((prev) =>
        prev.includes(sectionId)
          ? [] // Close the currently open section
          : [sectionId], // Open only the new section, close all others
      );
    },
    [isCollapsed],
  );

  const handleExpandSidebar = useCallback(
    (sectionId: string) => {
      // Expand the sidebar if it's collapsed
      if (isCollapsed) {
        handleCollapse();
      }
      // Auto-expand the clicked section, close all others
      setExpandedSections([sectionId]);
    },
    [isCollapsed, handleCollapse],
  );

  // Don't render sidebar on roadmap page
  if (pathname.includes("/roadmap")) {
    return (
      <div
        className="min-h-screen relative"
        style={{
          backgroundColor: resolvedBackgroundColor,
        }}
      >
        {children && (
          <div className="relative z-10">
            {typeof children === "function"
              ? children({ sidebarCollapsed: false })
              : children}
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      className="min-h-screen relative"
      style={{
        backgroundColor: resolvedBackgroundColor,
      }}
    >
      {/* Sidebar */}
      <div
        className={`transition-all duration-300 ${isModalOpen ? "blur-sm" : ""}`}
      >
        {/* Mobile overlay */}
        {isOpen && (
          <div
            aria-label="Close sidebar"
            className={`fixed inset-0 z-40 xl:hidden transition-all duration-300 ease-in-out ${
              isOpen ? 'bg-black/20 backdrop-blur-sm' : 'bg-transparent'
            }`}
            role="button"
            tabIndex={0}
            onClick={handleToggle}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                handleToggle();
              }
            }}
          />
        )}

        {/* Toggle button for mobile - Right side with animation */}
        <button
          aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
          className="fixed top-6 right-6 z-[101] xl:hidden bg-white/90 backdrop-blur-md p-3 rounded-2xl border-0 hover:bg-white transition-all duration-300 ease-in-out transform hover:scale-105 active:scale-95"
          onClick={handleToggle}
        >
          <div className="relative w-[22px] h-[22px]">
            <Menu
              size={22}
              className={`absolute top-0 left-0 text-gray-700 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-0 rotate-45 scale-75' : 'opacity-100 rotate-0 scale-100'
              }`}
            />
            <X
              size={22}
              className={`absolute top-0 left-0 text-gray-700 transition-all duration-300 ease-in-out ${
                isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-45 scale-75'
              }`}
            />
          </div>
        </button>

        {/* Sidebar */}
        <div
          className={`
            fixed z-[100]
            transform transition-all duration-400 ease-in-out
            ${isOpen ? "translate-y-0" : "-translate-y-full"}
            xl:translate-x-0 xl:translate-y-0
            w-full ${isCollapsed ? "xl:w-20" : "xl:w-64"} flex flex-col
            top-0 left-0 xl:left-4 xl:top-4
            h-auto max-h-[75vh] xl:h-[calc(100vh-2rem)] xl:max-h-none
            rounded-b-2xl xl:rounded-2xl
            xl:border xl:border-white/30
            bg-white xl:backdrop-blur-md
          `}
          style={{
            backgroundColor:
              pathname === "/roadmap"
                ? "rgba(154,205,50, 0.15)"
                : window.innerWidth < 1280
                  ? "#ffffff"
                  : "rgba(17,85,63, 0.10)",
          }}
        >
          {/* Header */}
          <SidebarHeader isCollapsed={isCollapsed} />


          {/* Collapse/Expand Button - Desktop only */}
          <button
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden xl:block absolute -right-3 top-20 bg-white/90 backdrop-blur-sm border border-white/30 rounded-xl p-2 shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white hover:scale-105 z-10"
            onClick={handleCollapse}
          >
            {isCollapsed ? (
              <ChevronRight className="text-gray-700" size={16} />
            ) : (
              <ChevronLeft className="text-gray-700" size={16} />
            )}
          </button>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 rounded-xl">
            {/* Main Section */}
            <div className="mb-6">
              <ul className="space-y-2">
                <SidebarNavigation isCollapsed={isCollapsed} onCloseSidebar={handleToggle} />
                <SidebarCollapsibleSection
                  expandedSections={expandedSections}
                  isCollapsed={isCollapsed}
                  onExpandSidebar={handleExpandSidebar}
                  onToggleSection={toggleSection}
                  onCloseSidebar={handleToggle}
                />
              </ul>
            </div>
          </nav>

          {/* Desktop: Storage Section */}
          <div className="hidden xl:block">
            <SidebarStorage isCollapsed={isCollapsed} />
          </div>

          {/* Desktop: User Profile Section */}
          <div className="hidden xl:block">
            <SidebarUserProfile isCollapsed={isCollapsed} />
          </div>
        </div>
      </div>

      {/* Main Content Wrapper */}
      {children && (
        <div
          className={`transition-all duration-300 ${
            pathname === "/roadmap" ? "" : isCollapsed ? "xl:ml-24" : "xl:ml-76"
          } relative z-10 pt-16 xl:pt-0`}
        >
          {typeof children === "function"
            ? children({ sidebarCollapsed: isCollapsed })
            : children}
        </div>
      )}
    </div>
  );
}

export default memo(UserSidebar);
