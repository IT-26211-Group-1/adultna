"use client";

import { useFileboxQuota } from "@/hooks/queries/useFileboxQueries";
import { formatFileSize } from "@/types/filebox";

interface SidebarStorageProps {
  isCollapsed: boolean;
}

export default function SidebarStorage({ isCollapsed }: SidebarStorageProps) {
  const { data: quotaResponse, isLoading } = useFileboxQuota();

  // Extract quota data with fallbacks
  const usedBytes = quotaResponse?.data?.usedStorageBytes ?? 0;
  const maxBytes = quotaResponse?.data?.maxStorageBytes ?? 104857600; // 100MB default
  const usedPercentage = quotaResponse?.data?.percentageUsed ?? 0;

  return (
    <div className="mt-auto p-6 border-t border-gray-200 rounded-b-xl">
      {!isCollapsed ? (
        <>
          <h3 className="text-sm font-medium text-gray-500 mb-3">Storage</h3>
          <div className="space-y-2">
            <div className="w-full bg-gray-200 rounded-xl h-2">
              {isLoading ? (
                <div
                  className="bg-gray-300 h-2 rounded-xl animate-pulse"
                  style={{ width: "50%" }}
                />
              ) : (
                <div
                  className="bg-adult-green h-2 rounded-xl transition-all duration-300"
                  style={{ width: `${Math.min(usedPercentage, 100)}%` }}
                />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {isLoading ? (
                <span className="animate-pulse">Loading...</span>
              ) : (
                `${formatFileSize(usedBytes)} of ${formatFileSize(maxBytes)} used`
              )}
            </p>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <div className="w-8 h-2 bg-gray-200 rounded-xl">
            {isLoading ? (
              <div
                className="bg-gray-300 h-2 rounded-xl animate-pulse"
                style={{ width: "50%" }}
              />
            ) : (
              <div
                className="bg-adult-green h-2 rounded-xl transition-all duration-300"
                style={{ width: `${Math.min(usedPercentage, 100)}%` }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}
