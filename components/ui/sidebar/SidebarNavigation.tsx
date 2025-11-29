"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { LayoutGrid, Map, Bot } from "lucide-react";
import { LucideIcon } from "lucide-react";

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  href: string;
}

interface SidebarNavigationProps {
  isCollapsed: boolean;
  onCloseSidebar?: () => void;
}

const navItems: NavItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutGrid,
    href: "/dashboard",
  },
  {
    id: "roadmap",
    label: "Roadmap",
    icon: Map,
    href: "/roadmap",
  },
  {
    id: "ai-gabay",
    label: "AI Gabay Agent",
    icon: Bot,
    href: "/ai-gabay",
  },
];

export default function SidebarNavigation({
  isCollapsed,
  onCloseSidebar,
}: SidebarNavigationProps) {
  const pathname = usePathname();

  const isActiveRoute = (href: string) => pathname === href;

  return (
    <ul className="space-y-2">
      {navItems.map((item) => {
        const isActive = isActiveRoute(item.href);

        return (
          <li key={item.id}>
            <Link
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-colors duration-200 ${
                isCollapsed ? "xl:justify-center" : ""
              } ${
                isActive
                  ? "bg-adult-green text-white shadow-md"
                  : "text-gray-700 hover:bg-white/50"
              }`}
              href={item.href}
              title={isCollapsed ? item.label : undefined}
              onClick={() => {
                // Close sidebar on mobile and tablet after navigation
                if (typeof window !== 'undefined' && window.innerWidth < 1280) {
                  onCloseSidebar?.();
                }
              }}
            >
              <item.icon
                className={`flex-shrink-0 ${
                  isActive ? "text-white" : "text-adult-green"
                }`}
                size={20}
              />
              <span
                className={`font-medium text-sm whitespace-nowrap ${
                  isActive ? "text-white" : ""
                } ${isCollapsed ? "xl:hidden" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
