"use client";

import { useState } from "react";
import type { AuditLogsFilter } from "@/types/audit";

type AuditLogsFiltersProps = {
  filters: AuditLogsFilter;
  onFiltersChange: (filters: AuditLogsFilter) => void;
};

const DATE_RANGES = {
  today: { label: "Today", days: 0 },
  last7days: { label: "Last 7 Days", days: 7 },
  last30days: { label: "Last 30 Days", days: 30 },
  last90days: { label: "Last 90 Days", days: 90 },
  custom: { label: "Custom Date Range", days: -1 },
} as const;

export default function AuditLogsFilters({
  filters,
  onFiltersChange,
}: AuditLogsFiltersProps) {
  const [dateRange, setDateRange] =
    useState<keyof typeof DATE_RANGES>("last7days");
  const [showCustomDates, setShowCustomDates] = useState(false);
  const [searchText, setSearchText] = useState("");
  const handleDateRangeChange = (range: keyof typeof DATE_RANGES) => {
    setDateRange(range);

    if (range === "custom") {
      setShowCustomDates(true);

      return;
    }

    setShowCustomDates(false);
    const config = DATE_RANGES[range];
    const endTime = new Date();
    const startTime = new Date();

    if (config.days === 0) {
      startTime.setHours(0, 0, 0, 0);
    } else {
      startTime.setDate(startTime.getDate() - config.days);
    }

    onFiltersChange({
      ...filters,
      startTime,
      endTime,
    });
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setSearchText(value);

    onFiltersChange({
      ...filters,
      userEmail: value || undefined,
      action: value || undefined,
    });
  };

  const handleStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      startTime: e.target.value ? new Date(e.target.value) : undefined,
    });
  };

  const handleEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      endTime: e.target.value ? new Date(e.target.value) : undefined,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="flex flex-wrap items-center gap-4">
        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          {Object.entries(DATE_RANGES).map(([key, { label }]) => (
            <button
              key={key}
              className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                dateRange === key
                  ? "bg-adult-green text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              onClick={() =>
                handleDateRangeChange(key as keyof typeof DATE_RANGES)
              }
            >
              {label}
            </button>
          ))}
        </div>

        {/* Search Filter */}
        <div className="flex-1 min-w-[300px]">
          <input
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green focus:border-transparent"
            placeholder="Type text to filter..."
            type="text"
            value={searchText}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      {/* Custom Date Range Inputs */}
      {showCustomDates && (
        <div className="mt-4 flex gap-4">
          <div className="flex-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="startTime"
            >
              Start Date
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
              id="startTime"
              type="datetime-local"
              value={
                filters.startTime
                  ? new Date(
                      filters.startTime.getTime() -
                        filters.startTime.getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleStartTimeChange}
            />
          </div>

          <div className="flex-1">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="endTime"
            >
              End Date
            </label>
            <input
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
              id="endTime"
              type="datetime-local"
              value={
                filters.endTime
                  ? new Date(
                      filters.endTime.getTime() -
                        filters.endTime.getTimezoneOffset() * 60000,
                    )
                      .toISOString()
                      .slice(0, 16)
                  : ""
              }
              onChange={handleEndTimeChange}
            />
          </div>
        </div>
      )}
    </div>
  );
}
