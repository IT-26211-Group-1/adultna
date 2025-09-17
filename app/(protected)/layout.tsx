import { ProtectedRoute } from "@/components/RouteGuards";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
