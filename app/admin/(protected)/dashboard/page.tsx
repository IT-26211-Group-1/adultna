import React from "react";

import { Stats } from "./_components/Stat";
import { Activity } from "./_components/Activity";

export default function page() {
  return (
    <div className="flex flex-col gap-4 sm:gap-6 p-4 sm:p-6 min-h-screen">
      <Stats />
      <Activity />
    </div>
  );
}
