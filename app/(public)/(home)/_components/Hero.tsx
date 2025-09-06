import { HeroText } from "./HeroText";
import { HeroIllustration } from "./HeroIllustrations";

export function Hero() {
  return (
    <section className="w-full min-h-[600px] flex flex-col md:flex-row items-center justify-between px-4 md:px-22 py-16 bg-white relative">
      <HeroText />
      <HeroIllustration />
    </section>
  );
}
