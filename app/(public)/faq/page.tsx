import React from "react";
import { FAQAccordion } from "./_components/FAQAccordion";
import { FAQText } from "./_components/FAQText";

export default function Page() {
  return (
    <section className="min-h-screen w-full py-8 md:py-16 px-4 sm:px-6 md:px-8 lg:px-16 xl:px-22 max-w-7xl mx-auto flex items-center">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start w-full">
        <FAQText />
        <FAQAccordion />
      </div>
    </section>
  );
}
