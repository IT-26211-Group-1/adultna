export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const headers = new Headers({
      "Content-Type": "application/json",
      ...(init?.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : init?.headers || {}),
    });
    const timeout = setTimeout(() => controller.abort(), 5000);

    const response = await fetch(input, { ...init, headers });

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
    return {
      success: false,
      message: error instanceof Error ? error.message : "Network Error",
    };
  }
}
