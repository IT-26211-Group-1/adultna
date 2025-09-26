"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface RouteGuardProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
  redirectTo?: string;
}

export function RouteGuard({
  children,
  redirectAuthenticated = false,
  redirectTo = "/dashboard",
}: RouteGuardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    return !isLoading && isAuthenticated && redirectAuthenticated;
  }, [isLoading, isAuthenticated, redirectAuthenticated]);

  // Show loading for redirect or auth check
  if (isLoading || shouldRedirect) {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(redirectTo), 0);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
