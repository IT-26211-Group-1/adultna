"use client";

import { Modal } from "@/components/ui/Modal";
import type { AuditLog } from "@/types/audit";
import AuditLogStatusBadge from "./AuditLogStatusBadge";

type AuditLogDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  log: AuditLog | null;
};

export default function AuditLogDetailsModal({
  isOpen,
  onClose,
  log,
}: AuditLogDetailsModalProps) {
  if (!log) return null;

  return (
    <Modal open={isOpen} size="lg" title="Audit Log Details" onClose={onClose}>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Timestamp</p>
            <p className="text-sm text-gray-900">
              {new Date(log.timestamp).toLocaleString()}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <div className="mt-1">
              <AuditLogStatusBadge status={log.status} />
            </div>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Service</p>
            <p className="text-sm text-gray-900">{log.service}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Action</p>
            <p className="text-sm text-gray-900">{log.action}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Resource</p>
            <p className="text-sm text-gray-900">{log.resource}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Resource ID</p>
            <p className="text-sm text-gray-900">{log.resourceId}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">User Email</p>
            <p className="text-sm text-gray-900">{log.userEmail}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">User Role</p>
            <p className="text-sm text-gray-900">{log.userRole}</p>
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-gray-500">Message</p>
          <p className="text-sm text-gray-900 mt-1">{log.message}</p>
        </div>

        {log.details && Object.keys(log.details).length > 0 && (
          <div>
            <p className="text-sm font-medium text-gray-500 mb-2">Details</p>
            <pre className="text-xs bg-gray-50 p-3 rounded-md overflow-x-auto">
              {JSON.stringify(log.details, null, 2)}
            </pre>
          </div>
        )}

        {log.errorMessage && (
          <div>
            <p className="text-sm font-medium text-red-500 mb-2">
              Error Message
            </p>
            <div className="bg-red-50 border border-red-200 p-3 rounded-md">
              <p className="text-sm text-red-900">{log.errorMessage}</p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
