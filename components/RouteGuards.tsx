"use client";

import { ReactNode, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./ui/LoadingSpinner";

type RouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
};

export function ProtectedRoute({ children, fallback, roles }: RouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    if (isLoading) return { redirect: false, to: null };

    if (!isAuthenticated) {
      return { redirect: true, to: "/auth/login" };
    }

    if (roles && user && !roles.includes(user.role)) {
      return { redirect: true, to: "/dashboard" };
    }

    return { redirect: false, to: null };
  }, [isLoading, isAuthenticated, user, roles]);

  if (isLoading || shouldRedirect.redirect) {
    if (shouldRedirect.redirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(shouldRedirect.to!), 0);
    }
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}

export function PublicRoute({ children, fallback }: RouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const shouldRedirect = !isLoading && isAuthenticated;

  if (isLoading || shouldRedirect) {
    if (shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace("/dashboard"), 0);
    }
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}

export function OnboardingRoute({ children, fallback }: RouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const router = useRouter();
  const hasRedirected = useRef(false);

  const shouldRedirect = useMemo(() => {
    if (isLoading) return { redirect: false, to: null };

    if (!isAuthenticated) {
      return { redirect: true, to: "/auth/login" };
    }

    if (user && user.role !== "user") {
      return { redirect: true, to: "/dashboard" };
    }

    return { redirect: false, to: null };
  }, [isLoading, isAuthenticated, user]);

  if (isLoading || shouldRedirect.redirect) {
    if (shouldRedirect.redirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(shouldRedirect.to!), 0);
    }
    return fallback || <LoadingSpinner />;
  }

  return <>{children}</>;
}
