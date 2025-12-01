"use client";

import { ProtectedRoute } from "@/components/RouteGuards";
import UserSidebar from "@/components/ui/sidebar/UserSidebar";
import { IdleWarningModal } from "@/components/ui/IdleWarningModal";
import { usePathname } from "next/navigation";
import { useAuth } from "@/hooks/queries/useAuthQueries";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const pathname = usePathname();
  const isAIGabayPage = pathname.startsWith("/ai-gabay");
  const isMockInterviewPage = pathname.startsWith("/mock-interview");
  const isMockInterviewResultsPage = pathname.startsWith(
    "/mock-interview/results",
  );
  const isResumeBuilderPage = pathname.startsWith("/resume-builder");
  const isCoverLetterPage = pathname.startsWith("/cover-letter");
  const { showIdleWarning, onStayActive, onLogoutNow } = useAuth();

  return (
    <ProtectedRoute roles={["user"]}>
      {isAIGabayPage ||
      (isMockInterviewPage && !isMockInterviewResultsPage) ||
      isResumeBuilderPage ||
      isCoverLetterPage ? (
        <div className="w-full h-screen overflow-hidden">{children}</div>
      ) : isMockInterviewResultsPage ? (
        <div className="w-full min-h-screen overflow-y-auto">{children}</div>
      ) : (
        <UserSidebar>{children}</UserSidebar>
      )}
      <IdleWarningModal
        open={showIdleWarning}
        onLogout={onLogoutNow}
        onStayActive={onStayActive}
      />
    </ProtectedRoute>
  );
}
