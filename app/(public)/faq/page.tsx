"use client";

import React from "react";
import { FAQAccordion } from "./_components/FAQAccordion";
import { FAQText } from "./_components/FAQText";

export default function Page() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <FAQText />
      <FAQAccordion />
    </section>
  );
}
