export async function apiFetch<T>(
  url: string,
  options?: RequestInit
): Promise<{ success: boolean; data?: T; message?: string }> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return {
        success: false,
        message: data?.message || "Something went wrong",
      };
    }

    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Network Error",
    };
  }
}
