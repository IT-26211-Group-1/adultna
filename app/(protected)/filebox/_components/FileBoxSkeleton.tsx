import { Skeleton } from "@/components/ui/Skeletons";

interface FileBoxSkeletonProps {
  viewType: "grid" | "list";
}

export function FileBoxSkeleton({ viewType }: FileBoxSkeletonProps) {
  if (viewType === "grid") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="border border-gray-200 rounded-lg p-6 space-y-3"
          >
            {/* Header - File Name and Actions */}
            <div className="flex items-start justify-between">
              <Skeleton className="h-7 w-3/4" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>

            {/* Category Badge */}
            <Skeleton className="h-6 w-24 rounded-full" />

            {/* Date Information and File Size */}
            <div className="flex justify-between items-end">
              <div className="space-y-1">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-36" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="flex items-center justify-between p-4 rounded-lg"
        >
          {/* Left Section - File Details */}
          <div className="flex items-center space-x-4 flex-1">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>

          {/* Middle Section - File Info */}
          <div className="hidden md:flex items-center space-x-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-40" />
          </div>

          {/* Right Section - Actions */}
          <div className="flex items-center ml-4">
            <Skeleton className="h-8 w-8 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );
}
