"use client";
import React from "react";

export default function Interview({
  slug,
  role,
}: {
  slug: string;
  role: string;
}) {
  // Placeholder reusable interview UI; expand with your flow/components
  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-gray-200 p-4">
        <p className="text-gray-700">
          This is a reusable interview component. Plug in your question flow, timers,
          scoring, recording, and feedback here.
        </p>
      </div>
    </div>
  );
}
