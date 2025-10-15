"use client";

import ProtectedPageWrapper from "@/components/ui/ProtectedPageWrapper";
import DashboardContent from "./DashboardContent";

export default function DashboardWrapper() {
  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }: { sidebarCollapsed: boolean }) => (
        <DashboardContent sidebarCollapsed={sidebarCollapsed} />
      )}
    </ProtectedPageWrapper>
  );
}
