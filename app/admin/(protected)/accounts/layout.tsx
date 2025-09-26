"use client";

import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { AdminMenu } from "@/components/admin/AdminMenu";
import { AdminHeader } from "@/components/admin/AdminHeader";

interface AccountsLayoutProps {
  children: React.ReactNode;
}

export default function AccountsLayout({ children }: AccountsLayoutProps) {
  return (
    <AdminRouteGuard allowedRoles={["technical_admin"]}>
      <div className="min-h-screen flex bg-slate-50 dark:bg-slate-900">
        <AdminMenu />
        <main className="flex-1 p-6">
          <AdminHeader />
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
    </AdminRouteGuard>
  );
}
