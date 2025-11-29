import dynamic from "next/dynamic";
import { Hero } from "@/app/(public)/(home)/_components/Hero";

const Problem = dynamic(
  () =>
    import("@/app/(public)/(home)/_components/Problem").then((mod) => ({
      default: mod.Problem,
    })),
  { ssr: true },
);
const Preview = dynamic(
  () =>
    import("@/app/(public)/(home)/_components/Preview").then((mod) => ({
      default: mod.Preview,
    })),
  { ssr: true },
);
const Roadmap = dynamic(
  () =>
    import("@/app/(public)/(home)/_components/Roadmap").then((mod) => ({
      default: mod.Roadmap,
    })),
  { ssr: true },
);
const CTA = dynamic(
  () =>
    import("@/app/(public)/(home)/_components/CTA").then((mod) => ({
      default: mod.CTA,
    })),
  { ssr: true },
);

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <Hero />
      <Problem />
      <Preview />
      <Roadmap />
      <CTA />
    </section>
  );
}
