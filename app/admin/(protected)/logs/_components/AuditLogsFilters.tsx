"use client";

import type { AuditLogsFilter } from "@/types/audit";

type AuditLogsFiltersProps = {
  filters: AuditLogsFilter;
  onFiltersChange: (filters: AuditLogsFilter) => void;
};

const ADMIN_SERVICES = [
  "admin-auth",
  "gov-guides",
  "onboarding",
  "feedback",
] as const;

export default function AuditLogsFilters({
  filters,
  onFiltersChange,
}: AuditLogsFiltersProps) {
  const handleServiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    onFiltersChange({
      ...filters,
      service: value || undefined,
    });
  };

  const handleActionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      action: e.target.value || undefined,
    });
  };

  const handleUserEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onFiltersChange({
      ...filters,
      userEmail: e.target.value || undefined,
    });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value as "success" | "failure" | "";
    onFiltersChange({
      ...filters,
      status: value || undefined,
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

  const handleClearFilters = () => {
    onFiltersChange({
      limit: 100,
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div>
          <label htmlFor="service" className="block text-sm font-medium text-gray-700 mb-1">
            Service
          </label>
          <select
            id="service"
            value={filters.service || ""}
            onChange={handleServiceChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Services</option>
            {ADMIN_SERVICES.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700 mb-1">
            Action
          </label>
          <input
            id="action"
            type="text"
            value={filters.action || ""}
            onChange={handleActionChange}
            placeholder="e.g., create_guide, update_account"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="userEmail" className="block text-sm font-medium text-gray-700 mb-1">
            User Email
          </label>
          <input
            id="userEmail"
            type="text"
            value={filters.userEmail || ""}
            onChange={handleUserEmailChange}
            placeholder="admin@example.com"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            id="status"
            value={filters.status || ""}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="success">Success</option>
            <option value="failure">Failure</option>
          </select>
        </div>

        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">
            Start Time
          </label>
          <input
            id="startTime"
            type="datetime-local"
            value={
              filters.startTime
                ? new Date(filters.startTime.getTime() - filters.startTime.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={handleStartTimeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">
            End Time
          </label>
          <input
            id="endTime"
            type="datetime-local"
            value={
              filters.endTime
                ? new Date(filters.endTime.getTime() - filters.endTime.getTimezoneOffset() * 60000)
                    .toISOString()
                    .slice(0, 16)
                : ""
            }
            onChange={handleEndTimeChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={handleClearFilters}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
