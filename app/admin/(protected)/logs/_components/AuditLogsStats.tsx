type AuditLogsStatsProps = {
  currentPage: number;
  pageSize: number;
  totalLogs: number;
};

export default function AuditLogsStats({
  currentPage,
  pageSize,
  totalLogs,
}: AuditLogsStatsProps) {
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalLogs);

  return (
    <p className="text-sm text-gray-600">
      Showing {startIndex} to {endIndex} of {totalLogs} logs
    </p>
  );
}
