"use client";

import { useState } from "react";
import Table from "@/components/ui/Table";
import type { AuditLog } from "@/types/audit";
import type { TableColumn } from "@/types/table";
import AuditLogStatusBadge from "./AuditLogStatusBadge";
import AuditLogDetailsModal from "./AuditLogDetailsModal";

type AuditLogsTableProps = {
  logs: AuditLog[];
  isLoading: boolean;
};

export default function AuditLogsTable({ logs, isLoading }: AuditLogsTableProps) {
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

  const columns: TableColumn<AuditLog>[] = [
    {
      header: "Timestamp",
      accessor: "timestamp",
      render: (log) => (
        <span className="text-sm">
          {new Date(log.timestamp).toLocaleString()}
        </span>
      ),
    },
    {
      header: "Service",
      accessor: "service",
      render: (log) => <span className="text-sm font-medium">{log.service}</span>,
    },
    {
      header: "Action",
      accessor: "action",
      render: (log) => <span className="text-sm">{log.action}</span>,
    },
    {
      header: "User",
      accessor: "userEmail",
      render: (log) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{log.userEmail}</span>
          <span className="text-xs text-gray-500">{log.userRole}</span>
        </div>
      ),
    },
    {
      header: "Resource",
      accessor: "resource",
      render: (log) => (
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
      accessor: "status",
      render: (log) => <AuditLogStatusBadge status={log.status} />,
    },
    {
      header: "Message",
      accessor: "message",
      render: (log) => (
        <span className="text-sm text-gray-600 truncate max-w-[200px] block">
          {log.message}
        </span>
      ),
    },
    {
      header: "Actions",
      accessor: "timestamp",
      render: (log) => (
        <button
          onClick={() => handleViewDetails(log)}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
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
        loading={isLoading}
        emptyMessage="No audit logs found"
      />

      <AuditLogDetailsModal
        isOpen={detailsModalOpen}
        onClose={handleCloseModal}
        log={selectedLog}
      />
    </>
  );
}
