"use client";

import { useCallback, memo } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { FolderOpen, Briefcase, Settings, ChevronDown, ChevronRight, User, LogOut, HardDrive } from "lucide-react";

interface SectionItem {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
  icon?: React.ComponentType<any>;
  isAction?: boolean;
}

interface SidebarCollapsibleSectionProps {
  isCollapsed: boolean;
  expandedSections: string[];
  onToggleSection: (sectionId: string) => void;
  onExpandSidebar?: (sectionId: string) => void;
  onCloseSidebar?: () => void;
}

const adultingToolkitItems: SectionItem[] = [
  {
    id: "govguides",
    label: "GovGuides",
    href: "/gov-guides",
  },
  {
    id: "adulting-filebox",
    label: "Adulting Filebox",
    href: "/filebox",
  },
];

const careerCenterItems: SectionItem[] = [
  {
    id: "resume-builder",
    label: "Resume Builder",
    href: "/resume-builder",
  },
  {
    id: "cover-letter",
    label: "Cover Letter Helper",
    href: "/cover-letter",
  },
  {
    id: "mock-interview",
    label: "Mock Interview Coach",
    href: "/mock-interview",
  },
  {
    id: "job-board",
    label: "Job Board",
    href: "/jobs",
  },
];

function SidebarCollapsibleSection({
  isCollapsed,
  expandedSections,
  onToggleSection,
  onExpandSidebar,
  onCloseSidebar,
}: SidebarCollapsibleSectionProps) {
  const pathname = usePathname();
  const { logout } = useAuth();

  const settingsItems: SectionItem[] = [
    {
      id: "profile-settings",
      label: "Profile Settings",
      href: "/profile",
      icon: User,
      isAction: false,
    },
    {
      id: "storage",
      label: "Storage",
      href: "/filebox",
      icon: HardDrive,
      isAction: false,
    },
    {
      id: "logout",
      label: "Logout",
      onClick: () => logout(),
      icon: LogOut,
      isAction: true,
    },
  ];

  const isActiveRoute = useCallback(
    (href: string) => pathname === href,
    [pathname],
  );

  const renderSection = useCallback(
    (
      sectionId: string,
      label: string,
      icon: React.ComponentType<any>,
      items: SectionItem[],
    ) => {
      const Icon = icon;
      const isExpanded = expandedSections.includes(sectionId);

      return (
        <li key={sectionId}>
          <div className="xl:hidden">
            {/* Mobile: Always show expanded view */}
            <button
              aria-expanded={isExpanded}
              className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-gray-700 hover:bg-white/50 transition-colors duration-200"
              onClick={() => onToggleSection(sectionId)}
            >
              <div className="flex items-center gap-3">
                <Icon className="text-adult-green flex-shrink-0" size={20} />
                <span className="font-medium text-sm">{label}</span>
              </div>
              {isExpanded ? (
                <ChevronDown size={16} />
              ) : (
                <ChevronRight size={16} />
              )}
            </button>

            {isExpanded && (
              <ul className="ml-8 space-y-2 mt-2">
                {items.map((item) => {
                  const isActive = item.href ? isActiveRoute(item.href) : false;
                  const ItemIcon = item.icon;

                  return (
                    <li key={item.id}>
                      {item.isAction || item.onClick ? (
                        <button
                          className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                            item.id === "logout"
                              ? "text-red-600 hover:bg-red-50"
                              : "text-gray-600 hover:bg-white/50"
                          }`}
                          onClick={() => {
                            item.onClick?.();
                            // Close sidebar on mobile after action
                            if (window.innerWidth < 1280) {
                              onCloseSidebar?.();
                            }
                          }}
                        >
                          {ItemIcon && <ItemIcon size={16} />}
                          {item.label}
                        </button>
                      ) : (
                        <Link
                          aria-current={isActive ? "page" : undefined}
                          className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                            isActive
                              ? "bg-adult-green text-white shadow-md"
                              : "text-gray-600 hover:bg-white/50"
                          }`}
                          href={item.href!}
                          onClick={() => {
                            // Close sidebar on mobile after navigation
                            if (window.innerWidth < 1280) {
                              onCloseSidebar?.();
                            }
                          }}
                        >
                          {ItemIcon && <ItemIcon size={16} />}
                          {item.label}
                        </Link>
                      )}
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="hidden xl:block">
            {/* Desktop: Respect collapsed state */}
            {!isCollapsed ? (
            <>
              <button
                aria-expanded={isExpanded}
                className="flex items-center justify-between w-full px-3 py-3 rounded-xl text-gray-700 hover:bg-white/50 transition-colors duration-200"
                onClick={() => onToggleSection(sectionId)}
              >
                <div className="flex items-center gap-3">
                  <Icon className="text-adult-green flex-shrink-0" size={20} />
                  <span className="font-medium text-sm">{label}</span>
                </div>
                {isExpanded ? (
                  <ChevronDown size={16} />
                ) : (
                  <ChevronRight size={16} />
                )}
              </button>

              {isExpanded && (
                <ul className="ml-8 space-y-2 mt-2">
                  {items.map((item) => {
                    const isActive = item.href ? isActiveRoute(item.href) : false;
                    const ItemIcon = item.icon;

                    return (
                      <li key={item.id}>
                        {item.isAction || item.onClick ? (
                          <button
                            className={`flex items-center gap-3 w-full px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                              item.id === "logout"
                                ? "text-red-600 hover:bg-red-50"
                                : "text-gray-600 hover:bg-white/50"
                            }`}
                            onClick={() => {
                              item.onClick?.();
                              // Close sidebar on mobile after action
                              if (window.innerWidth < 1280) {
                                onCloseSidebar?.();
                              }
                            }}
                          >
                            {ItemIcon && <ItemIcon size={16} />}
                            {item.label}
                          </button>
                        ) : (
                          <Link
                            aria-current={isActive ? "page" : undefined}
                            className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-colors duration-200 text-sm ${
                              isActive
                                ? "bg-adult-green text-white shadow-md"
                                : "text-gray-600 hover:bg-white/50"
                            }`}
                            href={item.href!}
                            onClick={() => {
                              // Close sidebar on mobile after navigation
                              if (window.innerWidth < 1280) {
                                onCloseSidebar?.();
                              }
                            }}
                          >
                            {ItemIcon && <ItemIcon size={16} />}
                            {item.label}
                          </Link>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          ) : (
            <button
              aria-label={label}
              className="flex items-center justify-center px-3 py-3 rounded-xl text-gray-700 hover:bg-white/50 transition-colors duration-200 w-full"
              title={label}
              onClick={() => onExpandSidebar?.(sectionId)}
            >
              <Icon className="text-adult-green flex-shrink-0" size={20} />
            </button>
          )}
          </div>
        </li>
      );
    },
    [
      isCollapsed,
      expandedSections,
      onToggleSection,
      onExpandSidebar,
      isActiveRoute,
    ],
  );

  return (
    <>
      {renderSection(
        "adulting-toolkit",
        "Adulting Toolkit",
        FolderOpen,
        adultingToolkitItems,
      )}
      {renderSection(
        "career-center",
        "Career Center",
        Briefcase,
        careerCenterItems,
      )}
      {/* Settings - Mobile Only */}
      <div className="xl:hidden">
        {renderSection("settings", "Settings", Settings, settingsItems)}
      </div>
    </>
  );
}

export default memo(SidebarCollapsibleSection);
