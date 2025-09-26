"use client";

import { useAdminAuth } from "@/hooks/queries/admin/useAdminQueries";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";
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
  redirectTo = "/admin/dashboard",
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
            ? "/admin/content"
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

    //  user role is not authenticated
    if (!redirectAuthenticated && isAuthenticated && user) {
      if (!allowedRoles.includes(user.role)) {
        return {
          type: "unauthorized",
          to: "/admin/unauthorized",
        };
      }
    }

    return false;
  }, [isLoading, isAuthenticated, user, redirectAuthenticated, allowedRoles]);

  // show loading
  if (isLoading || shouldRedirect) {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(shouldRedirect.to), 0);
    }

    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <LoadingSpinner />
      </div>
    );
  }

  return <>{children}</>;
}
