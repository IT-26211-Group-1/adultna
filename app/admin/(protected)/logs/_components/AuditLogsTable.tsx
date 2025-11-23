"use client";

import { useState } from "react";
import Table from "@/components/ui/Table";
import type { AuditLog } from "@/types/audit";
import type { Column } from "@/types/table";
import AuditLogStatusBadge from "./AuditLogStatusBadge";
import AuditLogDetailsModal from "./AuditLogDetailsModal";

type AuditLogsTableProps = {
  logs: AuditLog[];
  isLoading: boolean;
};

export default function AuditLogsTable({
  logs,
  isLoading,
}: AuditLogsTableProps) {
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

  const handleViewDetails = (log: AuditLog) => {
    setSelectedLog(log);
    setDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setDetailsModalOpen(false);
    setSelectedLog(null);
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);

    return date
      .toLocaleString("en-US", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
      .replace(",", "");
  };

  const formatAction = (action: string) => {
    return action
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const formatRole = (role: string) => {
    return role
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const columns: Column<AuditLog>[] = [
    {
      header: "Timestamp",
      accessor: (log: AuditLog) => (
        <span className="text-sm font-mono">
          {formatTimestamp(log.timestamp)}
        </span>
      ),
    },
    {
      header: "Service",
      accessor: (log: AuditLog) => (
        <span className="text-sm font-medium capitalize">
          {log.service.replace("-", " ")}
        </span>
      ),
    },
    {
      header: "Action",
      accessor: (log: AuditLog) => (
        <span className="text-sm">{formatAction(log.action)}</span>
      ),
    },
    {
      header: "User",
      accessor: (log: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{log.userEmail}</span>
          <span className="text-xs text-gray-500">
            {formatRole(log.userRole)}
          </span>
        </div>
      ),
    },
    {
      header: "Resource",
      accessor: (log: AuditLog) => (
        <div className="flex flex-col">
          <span className="text-sm">{log.resource}</span>
          <span className="text-xs text-gray-500 truncate max-w-[150px]">
            {log.resourceId}
          </span>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (log: AuditLog) => <AuditLogStatusBadge status={log.status} />,
    },
    {
      header: "Message",
      accessor: (log: AuditLog) => (
        <span className="text-sm text-gray-600 truncate max-w-[200px] block">
          {log.message}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: (log: AuditLog) => (
        <button
          className="text-sm text-adult-green hover:text-adult-green/80 font-medium"
          onClick={() => handleViewDetails(log)}
        >
          View Details
        </button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={logs}
        emptyMessage="No audit logs found"
        loading={isLoading}
      />

      <AuditLogDetailsModal
        isOpen={detailsModalOpen}
        log={selectedLog}
        onClose={handleCloseModal}
      />
    </>
  );
}
