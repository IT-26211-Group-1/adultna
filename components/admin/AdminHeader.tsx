"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { Bell, CircleUser } from "lucide-react";

type Notification = {
  id: string;
  title: string;
  body?: string;
  time?: string;
};

export const AdminHeader = () => {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

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

  // derive simple page title from pathname
  const getTitle = (path: string) => {
    if (path.includes("/admin/dashboard")) return "Admin Dashboard";
    if (path.includes("/admin/feedback")) return "User Feedback & Reports";
    if (path.includes("/admin/management")) return "User Management";
    if (path.includes("/admin/audit")) return "Audit Logs";
    if (path.includes("/admin/content")) return "Content Management";

    return "Admin Information Panel";
  };

  const title = getTitle(pathname);

  // Close on outside click or Escape
  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!dropdownRef.current) return;
      if (e.target instanceof Node && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }

    document.addEventListener("click", onDocClick);
    document.addEventListener("keydown", onKey);

    return () => {
      document.removeEventListener("click", onDocClick);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className="w-full flex items-center justify-between border border-slate-200 dark:border-slate-800 rounded-md px-4 py-2 bg-white dark:bg-slate-900">
      <h1 className="text-2xl font-semibold">{title}</h1>

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

        {/* User profile link */}
        <Link
          aria-label="User profile"
          className="p-2 rounded hover:bg-slate-100 dark:hover:bg-slate-800"
          href="/admin/user"
        >
          <CircleUser className="w-5 h-5" />
        </Link>
      </div>
    </header>
  );
};
