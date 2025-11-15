"use client";

import { ProtectedRoute } from "@/components/RouteGuards";
import UserSidebar from "@/components/ui/sidebar/UserSidebar";
import { usePathname } from "next/navigation";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  const isAIGabayPage = pathname.startsWith("/ai-gabay");

  // Debug: Log the pathname to confirm
  console.log("Current pathname:", pathname, "isAIGabayPage:", isAIGabayPage);

  return (
    <ProtectedRoute roles={["user"]}>
      {isAIGabayPage ? (
        <div className="w-full h-screen overflow-hidden">
          {children}
        </div>
      ) : (
        <UserSidebar>{children}</UserSidebar>
      )}
    </ProtectedRoute>
  );
}
