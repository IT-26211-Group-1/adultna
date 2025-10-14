"use client";

import React, { useState } from "react";
import ProtectedPageWrapper from "../../../components/ui/ProtectedPageWrapper";
import { GovGuidesList } from "./_components/GovGuidesList";
import { GovGuideDetails } from "./_components/GovGuideDetails";
import { GovOfficeFinder } from "./_components/GovOfficeFinder";
import { GovGuidesHeader } from "./_components/GovGuidesHeader";

type View = "list" | "detail" | "finder";

export default function Page() {
  const [view, setView] = useState<View>("list");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const openDetails = (id: string) => {
    setSelectedId(id);
    setView("detail");
  };
  const openFinder = () => setView("finder");
  const backToList = () => {
    setSelectedId(null);
    setView("list");
  };
  const backFromFinder = () => {
    if (selectedId) {
      setView("detail");
      return;
    }
    backToList();
  };

  return (
    <ProtectedPageWrapper>
      {({ sidebarCollapsed }) => (
        <div
          className={`transition-all duration-300 ${
            sidebarCollapsed ? "ml-10" : "ml-5"
          }`}
        >
          <main className={`transition-all duration-300 ${sidebarCollapsed ? "w-[calc(100%-40px)]" : "w-[calc(100%-30px)]"}`}>
            {view === "list" && (
              <GovGuidesList
                onSelect={(id) => openDetails(id)}
                onFindOffice={openFinder}
              />
            )}

            {view === "detail" && selectedId && (
              <GovGuideDetails id={selectedId} onBack={backToList} onFindOffice={openFinder} />
            )}

            {view === "finder" && <GovOfficeFinder onBack={backFromFinder} />}
          </main>
        </div>
      )}
    </ProtectedPageWrapper>
  );
}