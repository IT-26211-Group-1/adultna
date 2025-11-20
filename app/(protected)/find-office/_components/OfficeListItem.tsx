"use client";

import { OfficeLocation } from "./FindOfficeClient";

type OfficeListItemProps = {
  office: OfficeLocation;
  isSelected: boolean;
  onClick: () => void;
};

export default function OfficeListItem({
  office,
  isSelected,
  onClick,
}: OfficeListItemProps) {
  return (
    <button
      className={`w-full text-left p-4 rounded-lg border transition-all ${
        isSelected
          ? "border-adult-green bg-adult-green/5"
          : "border-gray-200 hover:border-adult-green hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <h3 className="font-semibold text-gray-900 mb-1">{office.name}</h3>
      <p className="text-sm text-gray-600 mb-2">{office.agency}</p>
      <p className="text-xs text-gray-500">{office.address}</p>
      {office.distance && (
        <p className="text-sm text-adult-green font-medium mt-2">
          {office.distance} km away
        </p>
      )}
    </button>
  );
}
