export function GovGuide() {
  const features = [
    {
      icon: "📋",
      title: "Benefits Application Agent helps with forms"
    },
    {
      icon: "🏛️",
      title: "Government Services Agent provides guidance"
    },
    {
      icon: "📝",
      title: "Document Prep Agent organizes requirements"
    },
    {
      icon: "📞",
      title: "Contact Helper Agent finds right departments"
    }
  ];

  return (
    <section className="w-full py-16relative px-4 md:px-22 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Content */}
        <div className="space-y-6">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight font-inter">
            Navigate government services, <span className="text-gray-500">simplified</span>
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed font-inter">
            Get your government processes and applications running smoothly with our comprehensive guidance system.
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Step-by-step application guidance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Document preparation assistance</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-adult-green text-lg">✓</span>
              <span className="text-gray-700 font-inter">Access to government service directories</span>
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
            Explore GovGuides <span>→</span>
          </button>
        </div>
      </div>
    </section>
  );
}
