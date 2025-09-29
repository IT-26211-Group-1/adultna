"use client";

import { Card, CardHeader, CardBody, Divider } from "@heroui/react";
import {
  useAdminUsers,
  useReportStats,
} from "@/hooks/queries/admin/useAdminQueries";

export function Stats() {
  const { users, isLoadingUsers, usersError } = useAdminUsers();
  const { reportStats, isLoadingStats, statsError } = useReportStats();

  // Calculate stats from real data
  const totalUsers = users?.length || 0;

  // Use real report statistics from the new API
  const totalReports = reportStats?.totalReports || 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5 px-20">
      <Card className="h-50 px-5 py-3">
        <CardHeader className="text-xl font-bold flex items-center justify-between">
          Total Users
          <button
            type="button"
            className="ml-2 p-1 rounded hover:bg-gray-100"
            title="View details"
            aria-label="View details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
              />
            </svg>
          </button>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="flex items-start justify-center h-full">
          {isLoadingUsers ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-adult-green border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          ) : usersError ? (
            <p className="text-2xl font-bold text-red-500">Error</p>
          ) : (
            <p className="text-4xl font-bold text-adult-green">{totalUsers}</p>
          )}
        </CardBody>
      </Card>

      <Card className="h-50 px-5 py-3">
        <CardHeader className="text-xl font-bold flex items-center justify-between">
          Total Reports
          <button
            type="button"
            className="ml-2 p-1 rounded hover:bg-gray-100"
            title="View details"
            aria-label="View details"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 18l6-6-6-6"
              />
            </svg>
          </button>
        </CardHeader>
        <Divider className="my-3" />
        <CardBody className="flex items-start justify-center h-full">
          {isLoadingStats ? (
            <div className="flex items-center justify-center w-full h-full">
              <div className="relative">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-200"></div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-adult-green border-t-transparent absolute top-0 left-0"></div>
              </div>
            </div>
          ) : statsError ? (
            <p className="text-2xl font-bold text-red-500">Error</p>
          ) : (
            <p className="text-4xl font-bold text-adult-green">
              {totalReports}
            </p>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
