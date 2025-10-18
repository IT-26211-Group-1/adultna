"use client";

import ProtectedPageWrapper from "../../../components/ui/ProtectedPageWrapper";
import { InterviewText } from "./_components/InterviewText";
import { CoachMenu } from "./_components/CoachMenu";

export default function Page() {
  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }) => (
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "ml-10" : "ml-2"
          }`}
        >
            <main
              className={`transition-all duration-300 ${
                sidebarCollapsed ? "w-[calc(100%-40px)]" : "w-[calc(100%-30px)]"
              }`}
            >
              {/* Two-column layout with equal height cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch mt-5 h-[95vh]">
                <div className="h-full">
                  <InterviewText />
                </div>
                <div className="h-full">
                  <CoachMenu />
                </div>
              </div>
          </main>
        </div>
      )}
    </ProtectedPageWrapper>
  );
}