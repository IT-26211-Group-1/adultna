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
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

  const renderNavButton = (item: NavItem) => (
    <button
      key={item.label}
      className="px-3 py-1.5 rounded-full text-xs md:text-sm font-medium font-inter transition-all duration-200 border border-adult-green text-gray-700 hover:bg-adult-green hover:text-white"
      onClick={() => handleNavClick(item.target)}
    >
      {item.label}
    </button>
  );

  return (
    <section className="w-full py-6 pb-20 bg-transparent relative flex flex-col gap-3 px-4 md:px-22 max-w-6xl mx-auto items-center justify-center">
      <nav className="flex flex-col gap-3 font-inter" id="feature-nav">
        {/* Top row - 4 items */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {topRowItems.map(renderNavButton)}
        </div>

        {/* Bottom row - 3 items */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3">
          {bottomRowItems.map(renderNavButton)}
        </div>

      </nav>
    </section>
  );
}
