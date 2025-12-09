"use client";

import {
  useAdminUsers,
  useReportStats,
  useAdminAuth,
} from "@/hooks/queries/admin/useAdminQueries";
import { DateDisplay } from "@/components/ui/DateDisplay";

export function Stats() {
  const { users, isLoadingUsers, usersError } = useAdminUsers();
  const { reportStats, isLoadingStats, statsError } = useReportStats();
  const { user } = useAdminAuth();

  // Calculate stats from real data
  const totalUsers = users?.length || 0;

  // Use real report statistics from the new API
  const totalReports = reportStats?.totalReports || 0;

  return (
    <div className="space-y-4">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ""}
          </h2>
          <p className="text-sm text-gray-600">Here's what's happening today</p>
        </div>
        <DateDisplay
          className="text-sm text-gray-500"
          format="datetime"
          updateInterval={1000}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {/* Registered Users Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 relative overflow-hidden h-36 shadow-none">
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-10 pointer-events-none">
            👥
          </div>
          <div className="flex justify-between items-start h-full">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                Registered Users
              </h3>
              <p className="text-gray-700 text-xs mb-2">
                Total platform users
              </p>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              {isLoadingUsers ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-adult-green border-t-transparent" />
              ) : usersError ? (
                <p className="text-sm font-bold text-red-500">Error</p>
              ) : (
                <div className="text-3xl font-bold text-adult-green">{totalUsers}</div>
              )}
            </div>
          </div>
        </div>

        {/* User Reports Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-4 relative overflow-hidden h-36 shadow-none">
          <div className="absolute -bottom-2 -right-2 text-6xl opacity-10 pointer-events-none">
            📊
          </div>
          <div className="flex justify-between items-start h-full">
            <div className="flex-1">
              <h3 className="text-sm font-bold text-gray-900 mb-1">
                User Reports
              </h3>
              <p className="text-gray-700 text-xs mb-2">
                Total submitted reports
              </p>
            </div>
            <div className="flex flex-col items-center justify-center h-full">
              {isLoadingStats ? (
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-adult-green border-t-transparent" />
              ) : statsError ? (
                <p className="text-sm font-bold text-red-500">Error</p>
              ) : (
                <div className="text-3xl font-bold text-adult-green">{totalReports}</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
