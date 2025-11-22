import { useEffect } from "react";

type UseAutoRefreshParams = {
  enabled: boolean;
  onRefresh: () => void;
  intervalMs?: number;
};

export function useAutoRefresh({
  enabled,
  onRefresh,
  intervalMs = 30000,
}: UseAutoRefreshParams) {
  useEffect(() => {
    if (!enabled) return;

    const interval = setInterval(() => {
      onRefresh();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [enabled, onRefresh, intervalMs]);
}
