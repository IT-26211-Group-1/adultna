"use client"; 

import React from "react";

import { Stats } from "./_components/Stats";
import { Activity } from "./_components/Activity";

export default function page() {
  return (
    <section>
      <Stats />
      <Activity />
    </section>
  );
}
