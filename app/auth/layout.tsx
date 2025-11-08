"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();

  const { isAuthenticated, isLoading } = useAuth();

  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    if (isLoading || !isAuthenticated) return false;

    // Allow onboarding for authenticated users
    if (pathname?.startsWith("/auth/onboarding")) {
      return false;
    }

    return true;
  }, [isLoading, isAuthenticated, pathname]);

  useEffect(() => {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace("/dashboard");
    }
  }, [shouldRedirect, router]);

  // Show loading for auth check or redirect
  if (isLoading || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
