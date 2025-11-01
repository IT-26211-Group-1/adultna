export function Interview() {
  const features = [
    {
      icon: "🎯",
      title: "Practice Question Agent delivers targeted scenarios"
    },
    {
      icon: "📊",
      title: "Feedback Analysis Agent reviews your responses"
    },
    {
      icon: "🎭",
      title: "Role-Play Agent simulates different industries"
    },
    {
      icon: "💬",
      title: "Communication Coach Agent improves delivery"
    }
  ];

  return (
    <section className="w-full py-16 bg-white relative px-4 md:px-22 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-inter">
            Ace your interviews, <span className="text-gray-500">every time</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-inter">
            Get your interview skills running smoothly with our AI-powered coaching platform.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Practice with realistic interview scenarios</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Get instant feedback and improvement tips</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Build confidence through repeated practice</span>
            </div>
          </div>
        </div>

        {/* Right Features */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-xl shadow-sm">
                {feature.icon}
              </div>
              <span className="text-gray-700 font-medium font-inter">{feature.title}</span>
            </div>
          ))}
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Explore interview coach <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
