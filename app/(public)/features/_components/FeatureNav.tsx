"use client";

import { NavItem } from "../../../../types/feature-nav";

export function FeatureNav() {
  const navItems: NavItem[] = [
    { label: "Personalized Roadmap", target: "roadmap-section" },
    { label: "GovGuides", target: "govguide-section" },
    { label: "Mock Interview Coach", target: "interview-section" },
    { label: "Adulting Filebox", target: "filebox-section" },
    { label: "Job Board", target: "job-section" },
    { label: "AI Gabay", target: "aigabay-section" },
    { label: "Smart Resume Builder", target: "resume-section" },
  ];

  const topRowItems = navItems.slice(0, 4);
  const bottomRowItems = navItems.slice(4, 7);

  function handleNavClick(targetId: string) {
    const element = document.getElementById(targetId);

    if (element) {
      element.scrollIntoView({
        behavior: "smooth",
        block: "center",
        inline: "nearest",
      });
    }
  }

  const renderNavButton = (item: NavItem) => (
    <button
      key={item.label}
      className="px-1.5 py-1 sm:px-3 sm:py-1.5 md:px-3 md:py-1.5 rounded-full text-[9px] sm:text-xs md:text-sm font-medium font-inter transition-all duration-200 border border-adult-green text-gray-700 hover:bg-adult-green hover:text-white whitespace-nowrap"
      onClick={() => handleNavClick(item.target)}
    >
      {item.label}
    </button>
  );

  return (
    <section className="w-full py-4 sm:py-6 pb-12 sm:pb-16 md:pb-20 bg-transparent relative flex flex-col gap-2 sm:gap-3 px-2 sm:px-4 md:px-8 lg:px-16 xl:px-22 max-w-6xl mx-auto items-center justify-center">
      <nav className="flex flex-col gap-2 sm:gap-3 font-inter w-full" id="feature-nav">
        {/* Mobile and Tablet: Let items flow naturally into rows with tighter spacing */}
        <div className="md:hidden">
          <div className="flex justify-center gap-1 sm:gap-2 flex-wrap">
            {navItems.map(renderNavButton)}
          </div>
        </div>

        {/* Desktop: Show in two rows */}
        <div className="hidden md:flex flex-col gap-3">
          {/* Top row - 4 items */}
          <div className="flex justify-center gap-3 flex-wrap">
            {topRowItems.map(renderNavButton)}
          </div>

          {/* Bottom row - 3 items */}
          <div className="flex justify-center gap-3 flex-wrap">
            {bottomRowItems.map(renderNavButton)}
          </div>
        </div>
      </nav>
    </section>
  );
}
