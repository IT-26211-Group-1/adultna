"use client";

import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const pathname = usePathname();
  const { isAuthenticated, isLoading } = useAuth();

  const hasRedirected = useRef(false);

  const redirectInfo = useMemo(() => {
    if (isLoading || !isAuthenticated) {
      return { shouldRedirect: false, redirectTo: null };
    }

    // Allow onboarding for authenticated users
    if (pathname?.startsWith("/auth/onboarding")) {
      return { shouldRedirect: false, redirectTo: null };
    }

    // Allow verify-email page to handle its own redirect
    if (pathname?.startsWith("/auth/verify-email")) {
      return { shouldRedirect: false, redirectTo: null };
    }

    // Redirect to dashboard for other auth pages (including login)
    return { shouldRedirect: true, redirectTo: "/dashboard" };
  }, [isLoading, isAuthenticated, pathname]);

  useEffect(() => {
    if (redirectInfo.shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      // Use window.location for hard navigation to prevent chunk loading errors
      window.location.href = redirectInfo.redirectTo!;
    }
  }, [redirectInfo]);

  // Show loading for auth check or redirect
  if (isLoading || redirectInfo.shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
