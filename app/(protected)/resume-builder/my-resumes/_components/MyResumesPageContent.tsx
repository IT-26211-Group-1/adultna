"use client";

import { ResumeList } from "../../_components/ResumeList";

export function MyResumesPageContent() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Main Content */}
      <div className="flex flex-col flex-1">
        <main className="flex-1 overflow-y-auto bg-gray-50">
          <ResumeList />
        </main>
      </div>
    </div>
  );
}
