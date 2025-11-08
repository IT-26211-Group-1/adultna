export function FAQText() {
  return (
    <div className="space-y-6 pt-16 md:pt-20 lg:pt-24">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-4 h-4 bg-ultra-violet rounded-sm flex items-center justify-center">
          <svg
            className="w-3 h-3 text-white"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2V9h2v8zm0-10h-2V5h2v2z" />
          </svg>
        </div>
        <span className="text-ultra-violet text-sm font-medium font-inter">
          Frequently Asked Questions
        </span>
      </div>

      <h1 className="text-3xl md:text-4xl lg:text-5xl text-gray-900 leading-tight font-playfair">
        Need a hand? <br />
        <span className="text-ultra-violet italic">
          You&apos;re in the right place.
        </span>
      </h1>

      <p className="text-base md:text-lg text-gray-600 leading-relaxed font-inter">
        We know adulting can be confusing sometimes, so we have gathered the
        most common questions to guide you every step of the way.
      </p>
    </div>
  );
}
