"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  HomeIcon,
  MessageCircle,
  FileText,
  Server,
  ChevronDown,
  ChevronUp,
  Users,
} from "lucide-react";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";

export const AdminMenu = () => {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const { user } = useAdminAuth();

  const isTechnicalAdmin = user?.role === "technical_admin";
  // const isVerifierAdmin = user?.role === "verifier_admin";

  const isActive = (href: string) => pathname === href;

  return (
    <aside className="w-64 h-screen bg-white border-r border-slate-200 dark:bg-slate-900 dark:border-slate-800 px-4 py-6 flex-shrink-0 text-adult-green">
      <div className="flex items-center justify-center gap-2 mb-6">
        <Link href="/admin/dashboard">
          <Image
            src="/AdultNa-Logo.png"
            alt="AdultNa Logo"
            width={140}
            height={56}
            className="object-contain"
          />
        </Link>
      </div>

      <nav className="space-y-4 text-sm">
        <hr className="border-slate-200 dark:border-slate-700 mb-4" />
        <Link
          aria-current={isActive("/admin/dashboard") ? "page" : undefined}
          className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
            isActive("/admin/dashboard") ? "bg-slate-100 dark:bg-slate-800" : ""
          }`}
          href="/admin/dashboard"
        >
          <HomeIcon className="w-4 h-4" />
          <span>Dashboard</span>
        </Link>

        {isTechnicalAdmin && (
          <Link
            aria-current={isActive("/admin/feedback") ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive("/admin/feedback")
                ? "bg-slate-100 dark:bg-slate-800"
                : ""
            }`}
            href="/admin/feedback"
          >
            <MessageCircle className="w-4 h-4" />
            <span>User Feedback & Report</span>
          </Link>
        )}

        {isTechnicalAdmin && (
          <Link
            aria-current={isActive("/admin/content") ? "page" : undefined}
            className={`flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 ${
              isActive("/admin/accounts")
                ? "bg-slate-100 dark:bg-slate-800"
                : ""
            }`}
            href="/admin/accounts"
          >
            <Users className="w-4 h-4" />
            <span>User Management</span>
          </Link>
        )}

        <div>
          {open ? (
            <button
              aria-expanded="true"
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span className="text-left">Content Management</span>
              </div>
              <ChevronUp className="w-4 h-4" />
            </button>
          ) : (
            <button
              aria-expanded="false"
              className="w-full flex items-center justify-between gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(true)}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span className="text-left">Content Management</span>
              </div>
              <ChevronDown className="w-4 h-4" />
            </button>
          )}

          {open && (
            <div className="mt-2 ml-4 flex flex-col gap-1">
              <Link
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                href="/admin/content/onboarding"
              >
                <span className="text-sm">Onboarding questions</span>
              </Link>

              <Link
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                href="/admin/content/guides"
              >
                <span className="text-sm">Government processes</span>
              </Link>

              <Link
                className="px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2"
                href="/admin/content/questions"
              >
                <span className="text-sm">Interview questions bank</span>
              </Link>
            </div>
          )}
        </div>

        {isTechnicalAdmin && (
          <Link
            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            href="/admin/logs"
          >
            <Server className="w-4 h-4" />
            <span>Audit Logs</span>
          </Link>
        )}
      </nav>
    </aside>
  );
};
