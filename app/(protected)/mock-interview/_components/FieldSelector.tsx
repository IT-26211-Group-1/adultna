"use client";

import React, { useMemo } from "react";
import { useQuestionIndustries } from "@/hooks/queries/admin/useInterviewQuestionQueries";

type Field = {
  id: string;
  label: string;
};

type FieldSelectorProps = {
  onSelectField: (fieldId: string) => void;
};

export function FieldSelector({ onSelectField }: FieldSelectorProps) {
  const { industries, isLoadingIndustries } = useQuestionIndustries();

  const fields: Field[] = useMemo(
    () =>
      industries.map((industry) => ({
        id: industry,
        label: industry
          .replace(/_/g, " ")
          .replace(/\b\w/g, (l) => l.toUpperCase()),
      })),
    [industries]
  );

  if (isLoadingIndustries) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose a Field</h2>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-adult-green"></div>
        </div>
      </div>
    );
  }

  if (fields.length === 0) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose a Field</h2>
        <div className="text-center py-8 text-gray-500">
          No fields available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Choose a Field</h2>
      <div className="space-y-2">
        {fields.map((field) => (
          <button
            key={field.id}
            onClick={() => onSelectField(field.id)}
            className="w-full px-6 py-4 text-left bg-white border border-gray-200 rounded-lg hover:border-adult-green hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-adult-green focus:ring-offset-2"
          >
            <span className="text-base font-medium text-gray-900">
              {field.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
