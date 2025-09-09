import React from "react";
import { AboutText } from "./_components/AboutText";
import { AboutMembers } from "./_components/AboutMembers";

export default function page() {
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <AboutText />
      <AboutMembers />
    </section>
  );
}
