"use client";

import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface ContentLayoutProps {
  children: React.ReactNode;
}

export default function ContentLayout({ children }: ContentLayoutProps) {
  return (
    <AdminRouteGuard allowedRoles={["technical_admin", "verifier_admin"]}>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        <AdminMenu />
        <main className="flex-1 overflow-auto h-screen">
          <AdminHeader />
          <div className="p-6">
            <div className="max-w-7xl mx-auto">{children}</div>
          </div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
