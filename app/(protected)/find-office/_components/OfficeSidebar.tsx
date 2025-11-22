"use client";

import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { OfficeLocation } from "./FindOfficeClient";
import OfficeListItem from "./OfficeListItem";

type OfficeSidebarProps = {
  initialSearch?: string;
  isLoadingLocation: boolean;
  offices: OfficeLocation[];
  selectedOffice: OfficeLocation | null;
  onOfficeSelect: (office: OfficeLocation) => void;
  onSearch: (query: string) => void;
};

export default function OfficeSidebar({
  initialSearch = "",
  isLoadingLocation,
  offices,
  selectedOffice,
  onOfficeSelect,
  onSearch,
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
        <h2 className="text-3xl font-semibold text-gray-900 leading-tight">
          Find a
          <br />
          Government
          <br />
          Office
        </h2>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-adult-green focus:border-transparent"
            placeholder="Search"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && searchQuery.trim()) {
                onSearch(searchQuery.trim());
              }
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {isLoadingLocation && (
          <div className="text-center py-8 text-gray-500">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adult-green mx-auto mb-2" />
            Getting your location...
          </div>
        )}

        {!isLoadingLocation && filteredOffices.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-sm">No offices found</p>
            <p className="text-xs mt-2">
              Try searching for an agency or location
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
