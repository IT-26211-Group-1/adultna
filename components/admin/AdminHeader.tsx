"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";
import { Bell, CircleUser, LogOut, User } from "lucide-react";
import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";

type Notification = {
  id: string;
  title: string;
  body?: string;
  time?: string;
};

export const AdminHeader = () => {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const userMenuRef = useRef<HTMLDivElement | null>(null);
  const { user, logout, isLoggingOut } = useAdminAuth();

  // Dummy notifications placeholder
  const notifications: Notification[] = [
    {
      id: "1",
      title: "New user signed up",
      body: "John Doe registered",
      time: "2h",
    },
    {
      id: "2",
      title: "Content submitted",
      body: "New onboarding question",
      time: "1d",
    },
    {
      id: "3",
      title: "Server backup",
      body: "Daily backup completed",
      time: "3d",
    },
  ];


  const handleLogout = useCallback(() => {
    const confirmed = window.confirm("Are you sure you want to logout?");

    if (confirmed) {
      logout();
    }
  }, [logout]);

  // Close on outside click or Escape
  const onDocClick = useCallback((e: MouseEvent) => {
    if (
      dropdownRef.current &&
      e.target instanceof Node &&
      !dropdownRef.current.contains(e.target)
    ) {
      setOpen(false);
    }
    if (
      userMenuRef.current &&
      e.target instanceof Node &&
      !userMenuRef.current.contains(e.target)
    ) {
      setUserMenuOpen(false);
    }
  }, []);

  const onKey = useCallback((e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setOpen(false);
      setUserMenuOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [onDocClick, onKey]);

  return (
    <header className="sticky top-0 z-40 w-full flex items-center justify-end border-b border-slate-200 dark:border-slate-800 px-6 py-3 bg-white dark:bg-slate-900">

      <div className="flex items-center gap-3">
        {/* Notifications dropdown */}
        <div ref={dropdownRef} className="relative">
          {open ? (
            <button
              aria-expanded="true"
              aria-haspopup="true"
              aria-label="Hide notifications"
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(false)}
            >
              <Bell className="w-5 h-5" />
            </button>
          ) : (
            <button
              aria-expanded="false"
              aria-haspopup="true"
              aria-label="Show notifications"
              className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
              onClick={() => setOpen(true)}
            >
              <Bell className="w-5 h-5" />
            </button>
          )}

          {open && (
            <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-50">
              <div className="p-3 border-b border-slate-100 dark:border-slate-800 font-medium">
                Notifications
              </div>
              <div className="max-h-56 overflow-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className="px-3 py-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                  >
                    <div className="text-sm font-semibold">{n.title}</div>
                    {n.body && (
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {n.body}
                      </div>
                    )}
                    {n.time && (
                      <div className="text-xs text-slate-400 mt-1">
                        {n.time}
                      </div>
                    )}
                  </div>
                ))}
                {notifications.length === 0 && (
                  <div className="p-3 text-sm text-slate-500">
                    No notifications
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-slate-100 dark:border-slate-800 text-center">
                <button
                  className="text-sm text-sky-600 hover:underline"
                  onClick={() => setOpen(false)}
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu dropdown */}
        <div ref={userMenuRef} className="relative">
          <button
            aria-expanded={userMenuOpen}
            aria-haspopup="true"
            aria-label="User menu"
            className="rounded hover:bg-slate-100 dark:hover:bg-slate-800 p-1"
            onClick={() => setUserMenuOpen(!userMenuOpen)}
          >
            {/* First letter of first and last name */}
            {user?.firstName || user?.lastName ? (
              <div className="w-7 h-7 rounded-full bg-adult-green text-white flex items-center justify-center text-xs font-semibold uppercase">
                {(user.firstName?.charAt(0) || "") +
                  (user.lastName?.charAt(0) || "")}
              </div>
            ) : (
              <div className="w-7 h-7 flex items-center justify-center">
                <CircleUser className="w-5 h-5" />
              </div>
            )}
          </button>

          {userMenuOpen && (
            <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-md shadow-lg z-50">
              <Link
                className="w-full px-4 py-2 hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-slate-700 dark:text-slate-300"
                href="/admin/profile"
                onClick={() => setUserMenuOpen(false)}
              >
                <User className="w-4 h-4" />
                <span>Profile</span>
              </Link>
              <button
                className="w-full px-4 py-2 text-left hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2 text-red-600 dark:text-red-400 border-t border-slate-100 dark:border-slate-800"
                disabled={isLoggingOut}
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
