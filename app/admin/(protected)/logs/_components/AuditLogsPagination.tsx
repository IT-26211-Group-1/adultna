import Pagination from "@/components/ui/Pagination";
import AuditLogsStats from "./AuditLogsStats";

type AuditLogsPaginationProps = {
  currentPage: number;
  pageSize: number;
  totalLogs: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

export default function AuditLogsPagination({
  currentPage,
  pageSize,
  totalLogs,
  totalPages,
  onPageChange,
}: AuditLogsPaginationProps) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <AuditLogsStats
        currentPage={currentPage}
        pageSize={pageSize}
        totalLogs={totalLogs}
      />

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
