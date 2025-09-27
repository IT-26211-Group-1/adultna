import React from "react";
import { AdminLoginForm } from "./_components/AdminLoginForm";
import { AdminRouteGuard } from "@/components/admin/AdminRouteGuard";

export default function AdminLoginPage() {
  return (
    <AdminRouteGuard redirectAuthenticated={true}>
      <AdminLoginForm />
    </AdminRouteGuard>
  );
}
