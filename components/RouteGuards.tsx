"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/providers/AuthProvider";
import { LoadingSpinner } from "./ui/LoadingSpinner";

type RouteProps = {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
};

export function ProtectedRoute({ children, fallback, roles }: RouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else if (roles && user && !roles.includes(user.role)) {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, roles, router]);

  if (isLoading) return fallback || <LoadingSpinner />;
  if (!isAuthenticated || (roles && user && !roles.includes(user.role)))
    return null;

  return <>{children}</>;
}

export function PublicRoute({ children, fallback }: RouteProps) {
  const { isAuthenticated, isLoading } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) return fallback || <LoadingSpinner />;
  if (isAuthenticated) return null;

  return <>{children}</>;
}

export function OnboardingRoute({ children, fallback }: RouteProps) {
  const { isAuthenticated, isLoading, user } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.replace("/auth/login");
      } else if (user && user.role !== "user") {
        router.replace("/dashboard");
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  if (isLoading) return fallback || <LoadingSpinner />;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
