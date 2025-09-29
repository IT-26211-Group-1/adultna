import React from "react";

export const TableSkeleton = () => (
  <div className="space-y-4">
    <div className="h-12 bg-gray-200 rounded animate-pulse" />
    {[...Array(5)].map((_, i) => (
      <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
    ))}
  </div>
);

export const ModalSkeleton = () => (
  <div className="w-6 h-6 bg-gray-200 rounded animate-pulse" />
);

export const ButtonSkeleton = () => (
  <div className="h-10 w-32 bg-gray-200 rounded animate-pulse" />
);
