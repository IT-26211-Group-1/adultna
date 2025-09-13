export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  timeout = 10000,
  _hasRetried = false,
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(init?.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : init?.headers || {}),
    });

    const response = await fetch(input, {
      ...init,
      headers,
      signal: controller.signal,
    });

    clearTimeout(id);

    const contentType = response.headers.get("Content-Type") || "";
    let data: unknown = null;

    if (contentType.includes("application/json")) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      if (response.status === 401 && !_hasRetried) {
        try {
          const refreshRes = await fetch("/api/auth/refresh", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
          });

          if (refreshRes.ok) {
            return apiFetch<T>(input, init, timeout, true);
          }
        } catch {}
      }

      return {
        success: false,
        status: response.status,
        message:
          (data as { message?: string })?.message ||
          `Request failed with status ${response.status}`,
      };
    }

    return { success: true, data: data as T, status: response.status };
  } catch (error: unknown) {
    clearTimeout(id);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Network Error",
    };
  }
}
