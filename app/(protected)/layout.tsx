import { ProtectedRoute } from "@/components/RouteGuards";
import { AuthProvider } from "@/providers/AuthProvider";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <AuthProvider>
      <ProtectedRoute roles={["user"]}>{children}</ProtectedRoute>
    </AuthProvider>
  );
}
