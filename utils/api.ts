export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  timeout = 10000,
): Promise<{ success: boolean; data?: T; message?: string }> {
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
      return {
        success: false,
        message:
          (data as { message?: string })?.message ||
          `Request failed with status ${response.status}`,
      };
    }

    return { success: true, data: data as T };
  } catch (error: unknown) {
    clearTimeout(id);

    return {
      success: false,
      message: error instanceof Error ? error.message : "Network Error",
    };
  }
}
