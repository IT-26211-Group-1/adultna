export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  status?: number;
}

// Get cookie value by name
const getCookie = (name: string): string | null => {
  if (typeof window === "undefined") return null;

  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);

  if (parts.length === 2) {
    return parts.pop()?.split(";").shift() || null;
  }

  return null;
};

// Get access token from cookies
const getAccessToken = (): string | null => {
  return getCookie("access_token");
};

export async function apiFetch<T>(
  input: RequestInfo,
  init?: RequestInit,
  timeout = 10000,
  _hasRetried = false,
): Promise<{ success: boolean; data?: T; message?: string; status?: number }> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  try {
    const accessToken = getAccessToken();

    const baseHeaders: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (accessToken) {
      baseHeaders.Authorization = `Bearer ${accessToken}`;
    }

    const initHeaders =
      init?.headers instanceof Headers
        ? Object.fromEntries(init.headers.entries())
        : (init?.headers as Record<string, string>) || {};

    const headers = new Headers({
      ...baseHeaders,
      ...initHeaders,
    });

    const response = await fetch(input, {
      ...init,
      headers,
      credentials: "include",
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
        if (typeof window !== "undefined") {
          window.location.href = "/auth/login";
        }
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
