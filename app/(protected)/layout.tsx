import { ProtectedRoute } from "@/components/RouteGuards";
import UserSidebar from "@/components/ui/sidebar/UserSidebar";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute roles={["user"]}>
      <UserSidebar>{children}</UserSidebar>
    </ProtectedRoute>
  );
}
