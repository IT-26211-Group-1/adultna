type AuditLogsHeaderProps = {
  totalLogs: number;
};

export default function AuditLogsHeader({ totalLogs }: AuditLogsHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
      <p className="text-sm text-gray-600 mt-1">
        View and filter admin activity logs
        {totalLogs > 0 && ` (${totalLogs} total logs)`}
      </p>
    </div>
  );
}
