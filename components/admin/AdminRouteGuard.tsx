"use client";

import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { LoadingSpinner } from "@/components/ui/LoadingSpinner";

interface AdminRouteGuardProps {
  children: React.ReactNode;
  redirectAuthenticated?: boolean;
  redirectTo?: string;
  allowedRoles?: string[];
}

export function AdminRouteGuard({
  children,
  redirectAuthenticated = false,
  // redirectTo = "/admin/dashboard",
  allowedRoles = ["technical_admin", "verifier_admin"],
}: AdminRouteGuardProps) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAdminAuth();
  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    if (isLoading) return false;

    // redirect authenticated users
    if (redirectAuthenticated && isAuthenticated) {
      return {
        type: "authenticated",
        to:
          user?.role === "verifier_admin"
            ? "/admin/dashboard"
            : "/admin/dashboard",
      };
    }

    // If user not authenticated
    if (!redirectAuthenticated && !isAuthenticated) {
      return {
        type: "unauthenticated",
        to: "/admin/login",
      };
    }

    // If user role is not authorized for this route
    if (!redirectAuthenticated && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        return {
          type: "unauthorized",
          to: "/admin/dashboard",
        };
      }
    }

    return false;
  }, [isLoading, isAuthenticated, user, redirectAuthenticated, allowedRoles]);

  useEffect(() => {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      router.replace(shouldRedirect.to);
    }
  }, [shouldRedirect, router]);

  // show loading
  if (isLoading || shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
