import { OnboardingRoute } from "@/components/RouteGuards";

interface OnboardingLayoutProps {
  children: React.ReactNode;
}

export default function OnboardingLayout({ children }: OnboardingLayoutProps) {
  return <OnboardingRoute>{children}</OnboardingRoute>;
}
