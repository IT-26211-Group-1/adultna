import { RetryButton } from "@/components/ui/RetryButton";

type AuditLogsErrorProps = {
  onRetry: () => void;
};

export default function AuditLogsError({ onRetry }: AuditLogsErrorProps) {
  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 text-center">
      <p className="text-red-600 mb-4">Failed to load audit logs</p>
      <RetryButton onRetry={onRetry} />
    </div>
  );
}
