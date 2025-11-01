export function AIGabay() {
  const features = [
    {
      icon: "💡",
      title: "Life Coach Agent provides personalized guidance"
    },
    {
      icon: "🎯",
      title: "Decision Helper Agent assists with choices"
    },
    {
      icon: "💬",
      title: "Chat Assistant Agent offers 24/7 support"
    },
    {
      icon: "📚",
      title: "Knowledge Base Agent shares life skills"
    }
  ];

  return (
    <section className="w-full py-16 bg-gray-50 relative px-4 md:px-22 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-inter">
            Get life guidance, <span className="text-gray-500">anytime</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-inter">
            Get your life decisions running smoothly with our AI-powered guidance companion.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">24/7 AI-powered life guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Personalized advice and recommendations</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Interactive chat support</span>
            </div>
          </div>
        </div>

        {/* Right Features */}
        <div className="space-y-4">
          {features.map((feature, index) => (
            <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg hover:bg-gray-100 transition-colors shadow-sm">
              <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xl">
                {feature.icon}
              </div>
              <span className="text-gray-700 font-medium font-inter">{feature.title}</span>
            </div>
          ))}
          <button className="mt-6 bg-black text-white px-6 py-3 rounded-lg font-medium font-inter hover:bg-gray-800 transition-colors inline-flex items-center gap-2">
            Explore AI Gabay <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}