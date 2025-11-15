"use client";

import { Spinner } from "@heroui/react";

export function GeneratingCoverLetterLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-full py-32">
      <Spinner color="success" size="lg" />
      <div className="mt-6 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Creating your cover letter...
        </h3>
        <p className="text-sm text-gray-600">
          Our AI is analyzing your resume and crafting a personalized cover
          letter
        </p>
      </div>
    </div>
  );
}
