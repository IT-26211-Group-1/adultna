import React from "react";

export interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps) => (
  <div className={`bg-gray-200 rounded animate-pulse ${className}`} />
);

export const TableSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-12" />
    {[...Array(5)].map((_, i) => (
      <Skeleton key={i} className="h-16" />
    ))}
  </div>
);

export const StatSkeleton = () => <Skeleton className="h-16" />;

export const ButtonSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={`h-10 w-32 ${className}`} />
);

export const ModalSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={`w-6 h-6 ${className}`} />
);

export const TextSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={`h-4 ${className}`} />
);

export const AvatarSkeleton = ({ className }: SkeletonProps) => (
  <Skeleton className={`w-8 h-8 rounded-full ${className}`} />
);

export const CardSkeleton = ({ className }: SkeletonProps) => (
  <div className={`space-y-3 p-4 border rounded-lg ${className}`}>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <Skeleton className="h-4 w-2/3" />
  </div>
);

export const ListItemSkeleton = ({ className }: SkeletonProps) => (
  <div className={`flex items-center space-x-3 p-3 ${className}`}>
    <AvatarSkeleton />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  </div>
);
