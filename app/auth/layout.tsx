"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter, usePathname } from "next/navigation";
import { useMemo, useRef } from "react";
// No loading screen needed for quick auth checks

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

  // Show loading for auth check or redirect
  if (isLoading || shouldRedirect) {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace("/dashboard"), 0);
    }

    return null;
  }

  return <>{children}</>;
}
