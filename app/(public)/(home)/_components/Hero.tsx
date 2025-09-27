import { HeroText } from "./HeroText";
import { HeroIllustration } from "./HeroIllustrations";

export function Hero() {
  return (
    <section className="w-full md:min-h-[500px] min-h-[420px] top-10 py-12 md:py-16 bg-white relative">
      {/* Centered content container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col items-center md:flex-row md:items-start justify-between gap-8">
        <div className="w-full md:w-1/2 text-center md:text-left how to ">
          <HeroText />
        </div>

        <div className="w-full flex items-center justify-center">
          <div className="w-full max-w-[500px] md:max-w-none">
            <HeroIllustration />
          </div>
        </div>
      </div>
    </section>
  );
}
