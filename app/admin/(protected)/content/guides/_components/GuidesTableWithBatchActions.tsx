"use client";

import React, { useState } from "react";
import { BatchGuideActions } from "./BatchGuideActions";

/**
 * Example wrapper component showing how to integrate batch actions
 * with the GuidesTable component.
 *
 * To use batch actions, you need to:
 * 1. Add checkbox column to the table
 * 2. Track selected guide IDs in state
 * 3. Render BatchGuideActions component
 * 4. Pass selection handlers to the table
 */

type Guide = {
  id: string;
  title: string;
  status: string;
  isActive: boolean;
  // ... other fields
};

type GuidesTableWithBatchActionsProps = {
  guides: Guide[];
  isArchiveView?: boolean;
};

export function GuidesTableWithBatchActions({
  guides,
  isArchiveView = false,
}: GuidesTableWithBatchActionsProps) {
  const [selectedGuideIds, setSelectedGuideIds] = useState<string[]>([]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedGuideIds(guides.map((g) => g.id));
    } else {
      setSelectedGuideIds([]);
    }
  };

  const handleSelectGuide = (guideId: string, checked: boolean) => {
    if (checked) {
      setSelectedGuideIds((prev) => [...prev, guideId]);
    } else {
      setSelectedGuideIds((prev) => prev.filter((id) => id !== guideId));
    }
  };

  const handleClearSelection = () => {
    setSelectedGuideIds([]);
  };

  const allSelected = guides.length > 0 && selectedGuideIds.length === guides.length;
  const someSelected = selectedGuideIds.length > 0 && !allSelected;

  return (
    <div className="space-y-4">
      {/* Batch Actions Bar */}
      <BatchGuideActions
        isArchiveView={isArchiveView}
        selectedGuideIds={selectedGuideIds}
        onClearSelection={handleClearSelection}
      />

      {/* Table with Checkboxes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-6 py-3">
                <input
                  checked={allSelected}
                  className="rounded border-gray-300 text-adult-green focus:ring-adult-green"
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  type="checkbox"
                  onChange={(e) => handleSelectAll(e.target.checked)}
                />
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {guides.map((guide) => (
              <tr
                key={guide.id}
                className={
                  selectedGuideIds.includes(guide.id) ? "bg-blue-50" : ""
                }
              >
                <td className="w-12 px-6 py-4">
                  <input
                    checked={selectedGuideIds.includes(guide.id)}
                    className="rounded border-gray-300 text-adult-green focus:ring-adult-green"
                    type="checkbox"
                    onChange={(e) =>
                      handleSelectGuide(guide.id, e.target.checked)
                    }
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {guide.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {guide.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {/* Individual actions dropdown */}
                  ...
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
