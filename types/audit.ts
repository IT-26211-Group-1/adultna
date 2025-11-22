export type AuditLogStatus = "success" | "failure";

export type AuditLog = {
  timestamp: string;
  level: string;
  service: string;
  action: string;
  resource: string;
  resourceId: string;
  userId: string;
  userEmail: string;
  userRole: string;
  status: AuditLogStatus;
  message: string;
  details?: Record<string, any>;
  errorMessage?: string;
};

export type AuditLogsFilter = {
  startTime?: Date;
  endTime?: Date;
  service?: string;
  action?: string;
  userEmail?: string;
  status?: AuditLogStatus;
  limit?: number;
};

export type AuditLogsResponse = {
  success: boolean;
  message: string;
  data: {
    logs: AuditLog[];
    total: number;
  };
};
