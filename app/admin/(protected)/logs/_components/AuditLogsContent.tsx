"use client";

import { useState } from "react";
import { useAuditLogs } from "@/hooks/queries/admin/useAuditLogsQueries";
import type { AuditLogsFilter } from "@/types/audit";
import AuditLogsHeader from "./AuditLogsHeader";
import AuditLogsFilters from "./AuditLogsFilters";
import AuditLogsTable from "./AuditLogsTable";
import ExportButton from "./ExportButton";
import AuditLogsPagination from "./AuditLogsPagination";
import AuditLogsError from "./AuditLogsError";

export default function AuditLogsContent() {
  const [filters, setFilters] = useState<AuditLogsFilter>({ limit: 100 });
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 20;

  const { data, isLoading, isError, refetch } = useAuditLogs(filters);

  const logs = data?.data?.logs || [];
  const total = data?.data?.total || 0;
  const paginatedLogs = logs.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );
  const totalPages = Math.ceil(logs.length / pageSize);

  if (isError) {
    return <AuditLogsError onRetry={() => refetch()} />;
  }

  return (
    <>
      <div className="flex items-center justify-between mb-6">
        <AuditLogsHeader totalLogs={total} />
        <ExportButton logs={logs} />
      </div>

      <AuditLogsFilters filters={filters} onFiltersChange={setFilters} />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <AuditLogsTable isLoading={isLoading} logs={paginatedLogs} />
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
