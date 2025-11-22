import Badge from "@/components/ui/Badge";
import type { AuditLogStatus } from "@/types/audit";

type AuditLogStatusBadgeProps = {
  status: AuditLogStatus;
};

export default function AuditLogStatusBadge({ status }: AuditLogStatusBadgeProps) {
  const variant = status === "success" ? "success" : "error";

  return (
    <Badge variant={variant} size="sm">
      {status}
    </Badge>
  );
}
