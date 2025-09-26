"use client";

export function FeatureNav() {
  const navItems = [
    { label: "Personalized Roadmap", target: "roadmap-section" },
    { label: "GovGuides", target: "govguide-section" },
    { label: "Mock Interview Coach", target: "interview-section" },
    { label: "Adulting Filebox", target: "filebox-section" },
    { label: "Job Board Listings", target: "job-section" },
  ];

  function handleScroll(targetId: string) {
    const el = document.getElementById(targetId);

    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section className="w-full min-h-[50px] top-10 py-8 md:py-16 bg-white relative flex flex-col gap-2 px-2 md:px-22 max-w-6xl items-center justify-center">
      <nav
        className="w-full md:w-5xl py-4 bg-gradient-to-r from-crayola-orange/60 to-periwinkle/70 shadow-md flex justify-center rounded-4xl"
        id="feature-nav"
      >
        <ul className="flex flex-wrap justify-center gap-2 md:gap-8 font-inter w-full">
          {navItems.map((item) => (
            <button
              key={item.label}
              className="relative px-2 py-2 md:px-4 md:py-2 rounded-lg hover:text-crayola-orange cursor-pointer group w-full sm:w-auto text-sm md:text-base"
              onClick={() => handleScroll(item.target)}
            >
              {item.label}
              <span className="absolute left-0 bottom-0 w-full h-0.5 bg-crayola-orange scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
            </button>
          ))}
        </ul>
      </nav>
    </section>
  );
}
