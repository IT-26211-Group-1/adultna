import { Skeleton } from "@/components/ui/Skeletons";

type FileBoxSkeletonProps = {
  viewType: "grid" | "list";
};

export function FileBoxSkeleton({ viewType }: FileBoxSkeletonProps) {
  return (
    <div>
      {/* Recent Files Section Skeleton */}
      <div className="mb-8">
        <div className="mb-4">
          <Skeleton className="h-7 w-32" />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-gray-50 rounded-lg p-4 flex flex-col items-center justify-center min-h-[120px]"
            >
              <div className="mb-3">
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-4 w-20 mb-1" />
              <Skeleton className="h-3 w-16 mb-2" />
              <Skeleton className="h-3 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* My Files Table Skeleton */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-7 w-24" />
              <Skeleton className="h-6 w-16 rounded" />
            </div>
            <div className="bg-gray-100 p-0.5 rounded-md">
              <div className="flex gap-1">
                <Skeleton className="h-8 w-8 rounded-sm" />
                <Skeleton className="h-8 w-8 rounded-sm" />
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          {viewType === "list" ? (
            /* List View Skeleton */
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-20" />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-24" />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-28" />
                    </th>
                    <th className="px-6 py-3 text-left">
                      <Skeleton className="h-4 w-16" />
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[...Array(6)].map((_, i) => (
                    <tr key={i} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <Skeleton className="h-8 w-8 rounded" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-16" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-24" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Skeleton className="h-4 w-4" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            /* Grid View Skeleton */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="p-4 border border-gray-200 rounded-lg bg-white"
                >
                  <div className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded" />
                    <div className="flex-1 min-w-0">
                      <Skeleton className="h-5 w-3/4 mb-1" />
                      <Skeleton className="h-4 w-1/2 mb-3" />
                      <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-12" />
                        <Skeleton className="h-5 w-16 rounded-full" />
                      </div>
                      <Skeleton className="h-3 w-24 mt-2" />
                    </div>
                    <Skeleton className="h-4 w-4" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
