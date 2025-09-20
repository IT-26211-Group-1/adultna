"use client";

import { useEffect, ReactNode, memo } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { LoadingSpinner } from "./ui/LoadingSpinner";

interface ProtectedRouteProps {
  children: ReactNode;
  fallback?: ReactNode;
  roles?: string[];
}

export const ProtectedRoute = memo(
  ({ children, fallback, roles }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        router.replace("/auth/login");
      } else if (roles && user && !roles.includes(user.role)) {
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return fallback || <LoadingSpinner />;
    }

    if (!isAuthenticated || (roles && !roles.includes(user?.role ?? "user"))) {
      return null;
    }

    return <>{children}</>;
  },
);

export const PublicRoute = memo(
  ({ children, fallback }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        router.replace("/dashboard");
      }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) {
      return fallback || <LoadingSpinner />;
    }

    // if (isAuthenticated) {
    //   return null;
    // }

    return <>{children}</>;
  },
);

export const OnboardingRoute = memo(
  ({ children, fallback }: ProtectedRouteProps) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.replace("/auth/login");
        } else if (user && user.role !== "pending") {
          router.replace("/dashboard");
        }
      }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) {
      return fallback || <LoadingSpinner />;
    }

    if (!isAuthenticated) {
      return null;
    }

    return <>{children}</>;
  },
);

LoadingSpinner.displayName = "LoadingSpinner";
ProtectedRoute.displayName = "ProtectedRoute";
PublicRoute.displayName = "PublicRoute";
