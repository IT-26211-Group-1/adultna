import { PublicRoute } from "@/components/RouteGuards";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <PublicRoute>{children}</PublicRoute>;
}
