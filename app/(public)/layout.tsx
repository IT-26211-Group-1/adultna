import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/Navbar";
import { RouteGuard } from "@/components/auth/RouteGuard";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RouteGuard redirectAuthenticated={true}>
      {/* TODO: Fix Navbar and Footer  */}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </RouteGuard>
  );
}
