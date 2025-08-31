import { Footer } from "@/components/ui/footer";
import { Navbar } from "@/components/ui/Navbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* TODO: Fix Navbar and Footer  */}
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  );
}
