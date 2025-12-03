import { OptimizedImage } from "@/components/ui/OptimizedImage";

export function Roadmap() {
  return (
    <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 lg:px-16 xl:px-22 pt-24 sm:pt-32 md:pt-40 pb-16 sm:pb-20 md:pb-24">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black leading-tight font-playfair pb-2 mb-6">
          Master Every{" "}
          <span className="italic text-adult-green">Milestone</span>
        </h2>

        <p className="text-sm sm:text-base md:text-base text-gray-700 max-w-4xl sm:max-w-5xl mx-auto font-inter leading-relaxed mb-8">
          AdultNa transforms overwhelming adult responsibilities into clear,
          achievable steps. Get personalized guidance, track your progress, and
          unlock each stage of your journey with confidence.
        </p>

        <div className="max-w-2xl mx-auto">
          <OptimizedImage
            alt="AdultNa roadmap showing milestones: education, career, finance, and personal growth"
            className="w-full h-auto rounded-xl"
            height={300}
            sizes="(max-width: 640px) 90vw, (max-width: 1024px) 80vw, 672px"
            src="/roadmap-horizontal.png"
            width={672}
          />
        </div>
      </div>
    </section>
  );
}
