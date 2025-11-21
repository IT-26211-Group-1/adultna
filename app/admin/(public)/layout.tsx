"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminPublicLayoutProps {
  children: React.ReactNode;
}

export default function AdminPublicLayout({
  children,
}: AdminPublicLayoutProps) {
  const pathname = usePathname();
  const { user, isAuthenticated, isLoading } = useAdminAuth();

  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    if (isLoading || !isAuthenticated) return false;

    // Allow forgot-password for authenticated users
    if (pathname?.startsWith("/admin/forgot-password")) {
      return false;
    }

    return {
      to: "/admin/dashboard",
    };
  }, [isLoading, isAuthenticated, pathname, user]);

  useEffect(() => {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use window.location for hard navigation to prevent chunk loading errors
      window.location.href = shouldRedirect.to;
    }
  }, [shouldRedirect]);

  // Show loading for auth check or redirect
  if (isLoading || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F8F5]">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
