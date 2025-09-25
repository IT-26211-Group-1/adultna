"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (!isLoading && isAuthenticated && redirectAuthenticated) {
      setIsRedirecting(true);
      router.replace(redirectTo);
    }
  }, [isAuthenticated, isLoading, redirectAuthenticated, redirectTo, router]);

  // Show loading spinner during auth check or redirect
  if (isLoading || isRedirecting) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  // isLoading
  if (isAuthenticated && redirectAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
