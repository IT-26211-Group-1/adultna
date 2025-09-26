"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminPublicLayoutProps {
  children: React.ReactNode;
}

export default function AdminPublicLayout({
  children,
}: AdminPublicLayoutProps) {
  const router = useRouter();
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
      to:
        user?.role === "verifier_admin" ? "/admin/content" : "/admin/dashboard",
    };
  }, [isLoading, isAuthenticated, pathname, user]);

  // Show loading for auth check or redirect
  if (isLoading || shouldRedirect) {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(shouldRedirect.to), 0);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F1F8F5]">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
