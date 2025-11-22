"use client";

import { useQuery } from "@tanstack/react-query";
import { ApiClient, queryKeys } from "@/lib/apiClient";
import type {
  AuditLog,
  AuditLogsFilter,
  AuditLogsResponse,
} from "@/types/audit";

// API Functions
const auditLogsApi = {
  listAuditLogs: (filters?: AuditLogsFilter): Promise<AuditLogsResponse> => {
    const params = new URLSearchParams();

    if (filters?.startTime) {
      params.append("startTime", filters.startTime.toISOString());
    }
    if (filters?.endTime) {
      params.append("endTime", filters.endTime.toISOString());
    }
    if (filters?.service) {
      params.append("service", filters.service);
    }
    if (filters?.action) {
      params.append("action", filters.action);
    }
    if (filters?.userEmail) {
      params.append("userEmail", filters.userEmail);
    }
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const queryString = params.toString();
    const endpoint = queryString
      ? `/audit-logs/list?${queryString}`
      : "/audit-logs/list";

    return ApiClient.get(endpoint);
  },
};

export function useAuditLogs(filters?: AuditLogsFilter, enabled: boolean = true) {
  return useQuery({
    queryKey: queryKeys.admin.auditLogs.list(filters),
    queryFn: () => auditLogsApi.listAuditLogs(filters),
    enabled,
    staleTime: 30000,
    refetchOnWindowFocus: false,
  });
}
