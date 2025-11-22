"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/queries/admin/useAuditLogsQueries";
import type { AuditLogsFilter } from "@/types/audit";
import AuditLogsHeader from "./AuditLogsHeader";
import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsTable from "./AuditLogsTable";
import AutoRefreshToggle from "./AutoRefreshToggle";
import ExportButton from "./ExportButton";
import AuditLogsStats from "./AuditLogsStats";
import AuditLogsPagination from "./AuditLogsPagination";
import AuditLogsError from "./AuditLogsError";
import { useAutoRefresh } from "./useAutoRefresh";

export default function AuditLogsContent() {
  const [filters, setFilters] = useState<AuditLogsFilter>({ limit: 100 });
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const { data, isLoading, isError, refetch } = useAuditLogs(filters);

  useAutoRefresh({ enabled: autoRefresh, onRefresh: refetch });

  const logs = data?.data?.logs || [];
  const total = data?.data?.total || 0;
  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  const totalPages = Math.ceil(logs.length / pageSize);

  if (isError) {
    return <AuditLogsError onRetry={() => refetch()} />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <AuditLogsHeader totalLogs={total} />

        <div className="flex items-center gap-3">
          <AutoRefreshToggle enabled={autoRefresh} onToggle={setAutoRefresh} />
          <ExportButton logs={logs} />
        </div>
      </div>

      <AuditLogsFilters filters={filters} onFiltersChange={setFilters} />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <AuditLogsTable logs={paginatedLogs} isLoading={isLoading} />
      </div>

      {total > 0 && (
        <AuditLogsPagination
          currentPage={currentPage}
          pageSize={pageSize}
          totalLogs={logs.length}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </>
  );
}
