"use client";

import React, { useMemo, memo } from "react";
import { useQuestionIndustries } from "@/hooks/queries/admin/useInterviewQuestionQueries";
import { Skeleton } from "@/components/ui/Skeletons";
import { RetryButton } from "@/components/ui/RetryButton";
import {
  Code,
  Palette,
  Briefcase,
  MessageSquare,
  GraduationCap,
  MapPin,
  Globe,
} from "lucide-react";

type Field = {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

// Icon mapping for different fields
const getFieldIcon = (
  fieldId: string,
): React.ComponentType<{ className?: string }> => {
  const lowerFieldId = fieldId.toLowerCase();

  if (
    lowerFieldId.includes("technology") ||
    lowerFieldId.includes("information")
  )
    return Code;
  if (lowerFieldId.includes("arts") || lowerFieldId.includes("design"))
    return Palette;
  if (lowerFieldId.includes("business") || lowerFieldId.includes("management"))
    return Briefcase;
  if (lowerFieldId.includes("communication")) return MessageSquare;
  if (lowerFieldId.includes("education")) return GraduationCap;
  if (lowerFieldId.includes("tourism") || lowerFieldId.includes("hospitality"))
    return MapPin;

  return Globe; // default for General and others
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
        icon: getFieldIcon(industry),
      })),
    [industries],
  );

  if (isLoadingIndustries) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Choose a Field
        </h2>
        <div className="space-y-2">
          {skeletonItems.map((i) => (
            <Skeleton
              key={i}
              className="h-16 rounded-xl animate-[pulse_1s_ease-in-out_infinite]"
            />
          ))}
        </div>
      </div>
    );
  }

  if (industriesError) {
    return (
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Choose a Field
        </h2>
        <div className="text-center py-6">
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
      <div className="space-y-4 sm:space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
          Choose a Field
        </h2>
        <div className="text-center py-6 text-gray-500">
          No fields available at the moment.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
        Choose a Field
      </h2>
      <div className="space-y-3">
        {fields.map((field) => {
          return (
            <button
              key={field.id}
              className="group w-full min-h-[44px] py-3 px-4 text-left bg-gray-100 rounded-xl hover:bg-adult-green hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-adult-green focus:ring-offset-2"
              onClick={() => onSelectField(field.id)}
            >
              <span className="text-sm font-semibold text-gray-900 group-hover:text-white transition-colors duration-200">
                {field.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
});
