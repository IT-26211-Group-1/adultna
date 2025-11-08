import { Hero } from "@/app/(public)/(home)/_components/Hero";
import { Problem } from "@/app/(public)/(home)/_components/Problem";
import { Preview } from "@/app/(public)/(home)/_components/Preview";
import { Roadmap } from "@/app/(public)/(home)/_components/Roadmap";
import { CTA } from "@/app/(public)/(home)/_components/CTA";

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
