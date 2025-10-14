"use client";

import { GovGuideSearch } from "./GovGuideSearch";
import { useMemo, useState } from "react";
import { GovGuidesHeader } from "./GovGuidesHeader";

type Props = {
  onSelect: (id: string) => void;
  onFindOffice: () => void;
};

// sample guides data (to be connected to database or API) + is called on by GovGuideDetails to show details
export const sampleGuides = [
    {   
        id: "driver-license", 
        title: "Driver's License", 
        description: "Get your driver's license with these simple steps.", 
        requirements: ["Valid ID", "E1 Form", "Birth Certificate (NSO)"], 
        duration: "2-3 weeks",
        fee: "₱2500",
        steps: [
            "Get a student permit",
            "Take the theoretical driving course",
            "Gather required documents",
            "Pass the written exam",
            "Pass the practical driving test",
            "Pay the necessary fees",
            "Receive your driver's license",
        ],
    },
    { 
        id: "passport", 
        title: "Passport", 
        description: "Apply for a passport with these requirements.", 
        requirements: ["Valid ID", "Passport Application Form"], 
        duration: "up to 1 week",
        fee: "₱870",
        steps: [
            "Fill out the passport application form",
            "Gather required documents",
        ],
    },
    { 
        id: "state-id", 
        title: "State ID", 
        description: "Obtain your state ID by following these steps.", 
        requirements: ["Valid ID", "Proof of Residency"], 
        duration: "2-3 weeks",
        fee: "₱450",
        steps: [
            "Fill out the state ID application form",
            "Gather required documents",
            "Submit your application at the nearest government office",
        ],
    },
    { 
        id: "voter-registration", 
        title: "Voter Registration", 
        description: "Register to vote with these simple steps.", 
        requirements: ["Valid ID", "Proof of Residency"], 
        duration: "1-2 weeks",
        fee: "₱0",
        steps: [
            "Fill out the voter registration form",
            "Gather required documents",
            "Submit your application at the nearest election office",
        ],
    },
    {
        id: "tax-identification-number",
        title: "Tax Identification Number (TIN)",
        description: "Apply for a TIN with these easy steps.",
        requirements: ["Valid ID", "Proof of Address"],
        duration: "3-5 days",
        fee: "₱0",
        steps: [
            "Fill out the TIN application form",
            "Gather required documents",
            "Submit your application at the nearest BIR office",
        ],
    }
];
export function GovGuidesList({ onSelect }: Props) {
    // state for search query and sort option
  const [searchQuery, setSearchQuery] = useState("");
  type SortKey = "title-asc" | "title-desc" | "duration-asc" | "duration-desc";
  const [sort, setSort] = useState<SortKey>("title-asc");

  function parseDurationToDays(raw: string): number {
    if (!raw) return Number.POSITIVE_INFINITY;
    const s = raw.toLowerCase().replace(/up to/gi, "").trim();
    const nums = s.match(/\d+(?:\.\d+)?/g);
    if (!nums || nums.length === 0) return Number.POSITIVE_INFINITY;
    const values = nums.map((n) => parseFloat(n));
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const isDay = /day/.test(s);
    const isWeek = /week/.test(s);
    const isMonth = /month/.test(s);
    if (isDay) return avg;
    if (isWeek) return avg * 7;
    if (isMonth) return avg * 30;
    return avg; // fallback unitless
  }

    // filter and sort guides based on search query and sort option
  const visibleGuides = useMemo(() => {
    const filtered = sampleGuides.filter((g) =>
      g.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const sorted = filtered.slice().sort((a, b) => {
      switch (sort) {
        case "title-asc":
          return a.title.localeCompare(b.title);
        case "title-desc":
          return b.title.localeCompare(a.title);
        case "duration-asc": {
          const ad = parseDurationToDays(a.duration);
          const bd = parseDurationToDays(b.duration);
          return ad - bd;
        }
        case "duration-desc": {
          const ad = parseDurationToDays(a.duration);
          const bd = parseDurationToDays(b.duration);
          return bd - ad;
        }
        default:
          return 0;
      }
    });

    return sorted;
  }, [searchQuery, sort]);

  return (
    <section className="w-full">
        
    <GovGuidesHeader />
        
    {/* search + sort */}
      <GovGuideSearch
        onSearch={(query) => setSearchQuery(query)}
        onSortChange={(k) => setSort(k)}
      />

    {/* renders the list of government guides in their own containers */}
      <ul className="grid grid-cols-1 gap-3">
        {visibleGuides.map((g) => (
            <li key={g.id}>
              <button
                onClick={() => onSelect(g.id)}
                className="w-full text-left p-5 border-2 rounded-lg hover:border-ultra-violet hover:bg-olivine/30 transition-colors duration-300 ease-out flex flex-col min-h-[160px]"
                >
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2 text-lg">
                        <div className="font-bold text-adult-green">{g.title}</div>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-chevron-right"
                        >
                            <polyline points="9 18 15 12 9 6" />
                        </svg>
                    </div>
                    <div className="text-sm">{g.description}</div>
                    <div className="text-xs text-gray-600 italic">
                    Requirements: {g.requirements.length > 0 ? g.requirements.join(", ") : "No requirements listed."}
                    </div>
                </div>

                <div className="mt-auto self-end flex items-center gap-2 text-gray-700 text-xs">
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-clock-icon lucide-clock"
                    >
                    <path d="M12 6v6l4 2" />
                    <circle cx="12" cy="12" r="10" />
                    </svg>
                    <span>{g.duration}</span>
                </div>
                </button>
            </li>
          ))}
      </ul>
    </section>
  );
}