import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/Navbar";
import PublicPageWrapper from "@/components/ui/PublicPageWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <PublicPageWrapper>
      {/* TODO: Fix Navbar and Footer  */}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </PublicPageWrapper>
  );
}
