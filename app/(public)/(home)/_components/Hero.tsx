import { HeroText } from "./HeroText";
import { HeroIllustration } from "./HeroIllustrations";

export function Hero() {
  return (
    <section className="w-full min-h-[500px] top-10 py-16 bg-transparent relative">
      {/* Centered content container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="w-full md:w-1/2">
          <HeroText />
        </div>
        <div className="w-full md:w-1/2 flex items-center justify-center">
          <HeroIllustration />
        </div>
      </div>
    </section>
  );
}
