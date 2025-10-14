"use client";

import React, { useState, useCallback, useMemo, memo } from "react";
import { Menu, X, ChevronLeft, ChevronRight } from "lucide-react";
import SidebarHeader from "./SidebarHeader";
import SidebarNavigation from "./SidebarNavigation";
import SidebarCollapsibleSection from "./SidebarCollapsibleSection";
import SidebarStorage from "./SidebarStorage";

interface SidebarProps {
  isOpen?: boolean;
  onToggle?: () => void;
  isCollapsed?: boolean;
  onCollapse?: () => void;
}

function UserSidebar({
  isOpen: controlledIsOpen,
  onToggle,
  isCollapsed: controlledIsCollapsed,
  onCollapse,
}: SidebarProps) {
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

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
          ? prev.filter((id) => id !== sectionId)
          : [...prev, sectionId],
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
      // Auto-expand the clicked section
      setExpandedSections((prev) =>
        prev.includes(sectionId) ? prev : [...prev, sectionId],
      );
    },
    [isCollapsed, handleCollapse],
  );

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          aria-label="Close sidebar"
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
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

      {/* Toggle button for mobile */}
      <button
        aria-label="Toggle sidebar"
        className="fixed top-4 left-4 z-50 lg:hidden bg-white/70 p-2 rounded-md shadow-md border"
        onClick={handleToggle}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`
          fixed top-4 left-4 h-[calc(100vh-2rem)] backdrop-blur-md border border-white/30 rounded-2xl shadow-lg z-[100]
          transform transition-all duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-64 flex flex-col
        `}
        style={{ backgroundColor: "rgba(17,85,63, 0.10)" }}
      >
        {/* Header */}
        <SidebarHeader isCollapsed={isCollapsed} />

        {/* Collapse/Expand Button - Desktop only */}
        <button
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="hidden lg:flex absolute -right-3 top-20 bg-white/70 border border-gray-200 rounded-xl p-1.5 shadow-md hover:shadow-lg transition-all duration-200 hover:bg-gray-50 z-10"
          onClick={handleCollapse}
        >
          {isCollapsed ? (
            <ChevronRight className="text-gray-600" size={16} />
          ) : (
            <ChevronLeft className="text-gray-600" size={16} />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 rounded-xl">
          {/* Main Section */}
          <div className="mb-6">
            <ul className="space-y-2">
              <SidebarNavigation isCollapsed={isCollapsed} />
              <SidebarCollapsibleSection
                expandedSections={expandedSections}
                isCollapsed={isCollapsed}
                onExpandSidebar={handleExpandSidebar}
                onToggleSection={toggleSection}
              />
            </ul>
          </div>
        </nav>

        {/* Storage Section */}
        <SidebarStorage isCollapsed={isCollapsed} />
      </div>
    </>
  );
}

export default memo(UserSidebar);
