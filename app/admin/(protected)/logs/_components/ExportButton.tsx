import type { AuditLog } from "@/types/audit";

type ExportButtonProps = {
  logs: AuditLog[];
  disabled?: boolean;
};

export default function ExportButton({ logs, disabled }: ExportButtonProps) {
  const handleExport = () => {
    if (logs.length === 0) return;

    const headers = [
      "Timestamp",
      "Service",
      "Action",
      "Resource",
      "Resource ID",
      "User Email",
      "User Role",
      "Status",
      "Message",
      "Error Message",
    ];

    const csvContent = [
      headers.join(","),
      ...logs.map((log) =>
        [
          new Date(log.timestamp).toISOString(),
          log.service,
          log.action,
          log.resource,
          log.resourceId,
          log.userEmail,
          log.userRole,
          log.status,
          `"${log.message.replace(/"/g, '""')}"`,
          log.errorMessage ? `"${log.errorMessage.replace(/"/g, '""')}"` : "",
        ].join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);

    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `audit-logs-${new Date().toISOString().split("T")[0]}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
      disabled={disabled || logs.length === 0}
      onClick={handleExport}
    >
      Export to CSV
    </button>
  );
}
