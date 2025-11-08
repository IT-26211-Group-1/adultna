import Link from "next/link";

export function CTA() {
  return (
    <section className="w-full px-8 sm:px-12 md:px-16 lg:px-20 xl:px-24 py-16 sm:py-20 md:py-24">
      <div className="bg-indigo-50 rounded-2xl px-16 sm:px-20 md:px-24 lg:px-32 xl:px-40 py-12 sm:py-16 md:py-20">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="lg:flex-1 lg:max-w-2xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-black leading-tight font-playfair pb-2 mb-6">
              Start your journey{" "}
              <span className="italic text-adult-green">today.</span>
            </h2>
            <p className="text-sm sm:text-base md:text-base text-gray-700 font-inter leading-relaxed">
              Navigate your adult life with confidence and clarity. Join thousands of young adults mastering essential skills with AdultNa's personalized guidance.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 lg:flex-shrink-0">
            <Link
              href="/features"
              className="bg-transparent text-adult-green border-2 border-adult-green px-6 py-3 rounded-xl font-medium text-base hover:bg-adult-green hover:text-white transition-colors duration-200 flex items-center justify-center"
            >
              Learn more
            </Link>

            <Link
              href="/auth/login"
              className="bg-adult-green text-white px-6 py-3 rounded-xl font-medium text-base hover:bg-adult-green/90 transition-colors duration-200 flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}