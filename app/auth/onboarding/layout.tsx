"use client";

// No loading screen needed for quick onboarding checks
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useMemo, useRef } from "react";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  const hasRedirected = useRef(false);

  const redirectInfo = useMemo(() => {
    if (isLoading || !user) {
      return { shouldRedirect: false, redirectTo: null };
    }

    // Redirect if onboarding is completed
    if (user.onboardingStatus === "completed") {
      return { shouldRedirect: true, redirectTo: "/dashboard" };
    }

    // Redirect users with invalid onboarding status
    if (
      user.onboardingStatus &&
      !["not_started", "in_progress"].includes(user.onboardingStatus)
    ) {
      return { shouldRedirect: true, redirectTo: "/dashboard" };
    }

    return { shouldRedirect: false, redirectTo: null };
  }, [isLoading, user]);

  // Show loading for auth check or redirect
  if (isLoading || redirectInfo.shouldRedirect) {
    if (redirectInfo.shouldRedirect && !hasRedirected.current) {
      hasRedirected.current = true;
      setTimeout(() => router.replace(redirectInfo.redirectTo!), 0);
    }

    return null;
  }

  return <>{children}</>;
}
