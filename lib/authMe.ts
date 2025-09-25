export interface AuthUser {
  userId: string;
  email: string;
  isVerified: boolean;
}

export interface AuthMeResponse {
  success: boolean;
  user?: AuthUser;
  message?: string;
}

export async function authMeRequest(): Promise<AuthMeResponse> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/auth/me`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    if (!res.ok) {
      return { success: false, message: "Unauthorized" };
    }

    const response = await res.json();

    return response;
  } catch {
    return { success: false, message: "Network error" };
  }
}
