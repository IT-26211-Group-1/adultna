"use client";

import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";
import { AdminErrorBoundary } from "@/components/admin/AdminErrorBoundary";

interface AdminProtectedLayoutProps {
  children: React.ReactNode;
}

export default function AdminProtectedLayout({
  children,
}: AdminProtectedLayoutProps) {
  return (
    <AdminRouteGuard allowedRoles={["technical_admin", "verifier_admin"]}>
      <AdminErrorBoundary>{children}</AdminErrorBoundary>
    </AdminRouteGuard>
  );
}
