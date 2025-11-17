"use client";

import React, { useMemo, memo } from "react";
import { useQuestionIndustries } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { Skeleton } from "@/components/ui/Skeletons";
import { RetryButton } from "@/components/ui/RetryButton";

type Field = {
  id: string;
  label: string;
};

type FieldSelectorProps = {
  onSelectField: (fieldId: string) => void;
};

const SKELETON_COUNT = 5;
const skeletonItems = Array.from({ length: SKELETON_COUNT }, (_, i) => i);

// Format field label (outside component for performance)
const formatFieldLabel = (industry: string) =>
  industry.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

export const FieldSelector = memo(function FieldSelector({
  onSelectField,
}: FieldSelectorProps) {
  const {
    industries,
    isLoadingIndustries,
    industriesError,
    refetchIndustries,
  } = useQuestionIndustries();

  const fields: Field[] = useMemo(
    () =>
      industries.map((industry) => ({
        id: industry,
        label: formatFieldLabel(industry),
      })),
    [industries],
  );

  if (isLoadingIndustries) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose a Field</h2>
        <div className="space-y-2">
          {skeletonItems.map((i) => (
            <Skeleton
              key={i}
              className="h-16 animate-[pulse_1s_ease-in-out_infinite]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (industriesError) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Choose a Field</h2>
        <div className="text-center py-8">
          <p className="text-red-600 mb-4">
            Failed to load fields. Please try again.
          </p>
          <RetryButton onRetry={refetchIndustries} />
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
            className="w-full px-6 py-4 text-left bg-white border border-gray-200 rounded-lg hover:border-adult-green hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-adult-green focus:ring-offset-2"
            onClick={() => onSelectField(field.id)}
          >
            <span className="text-base font-medium text-gray-900">
              {field.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
});
