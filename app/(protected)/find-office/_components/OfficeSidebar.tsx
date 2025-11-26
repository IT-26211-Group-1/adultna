"use client";

import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { OfficeLocation } from "./FindOfficeClient";
import OfficeListItem from "./OfficeListItem";
import { Breadcrumb } from "@/components/ui/Breadcrumb";

type OfficeSidebarProps = {
  initialSearch?: string;
  isLoadingLocation: boolean;
  offices: OfficeLocation[];
  selectedOffice: OfficeLocation | null;
  onOfficeSelect: (office: OfficeLocation) => void;
  onSearch: (query: string) => void;
  guideTitle?: string;
  guideSlug?: string;
};

export default function OfficeSidebar({
  initialSearch = "",
  isLoadingLocation,
  offices,
  selectedOffice,
  onOfficeSelect,
  onSearch,
  guideTitle,
  guideSlug,
}: OfficeSidebarProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [filteredOffices, setFilteredOffices] = useState<OfficeLocation[]>([]);

  useEffect(() => {
    const filtered = offices.filter(
      (office) =>
        office.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.agency.toLowerCase().includes(searchQuery.toLowerCase()) ||
        office.address.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    setFilteredOffices(filtered);
  }, [searchQuery, offices]);

  return (
    <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6 space-y-4">
        <Breadcrumb
          items={[
            { label: "Government Guides", href: "/gov-guides" },
            ...(guideTitle && guideSlug
              ? [{ label: guideTitle, href: `/gov-guides/${guideSlug}` }]
              : []),
            { label: "Gov Map", current: true },
          ]}
        />
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adult-green focus:border-adult-green shadow-sm transition-all duration-200 hover:border-gray-400"
            placeholder="Search agencies, offices, or services..."
            type="text"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              if (e.target.value.trim()) {
                onSearch(e.target.value.trim());
              }
            }}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => {
                setSearchQuery("");
                onSearch("");
              }}
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoadingLocation && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adult-green mx-auto mb-3" />
            <p className="text-gray-600 font-medium">
              Getting your location...
            </p>
            <p className="text-xs text-gray-500 mt-1">
              This helps find nearby offices
            </p>
          </div>
        )}

        {!isLoadingLocation && filteredOffices.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">No offices found</p>
            <p className="text-sm text-gray-500">
              Try searching for different keywords or check your spelling
            </p>
          </div>
        )}

        {!isLoadingLocation && filteredOffices.length === 0 && !searchQuery && (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-900 font-medium mb-1">Start your search</p>
            <p className="text-sm text-gray-500">
              Search for government agencies, offices, or services
            </p>
          </div>
        )}

        <div className="space-y-3">
          {filteredOffices.map((office, index) => (
            <OfficeListItem
              key={index}
              isSelected={selectedOffice === office}
              office={office}
              onClick={() => onOfficeSelect(office)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
