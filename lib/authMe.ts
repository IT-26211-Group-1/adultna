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
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      method: "GET",
      credentials: "include",
    });

    if (!res.ok) {
      // Try to get the error message from the response
      const errorData = await res.json().catch(() => ({}));
      const errorMessage = errorData?.message || "Unauthorized";

      // If account is deactivated, show specific message
      if (errorMessage.includes("deactivated")) {
        return {
          success: false,
          message:
            "Your account is deactivated. Please contact support to re-activate your account.",
        };
      }

      return { success: false, message: errorMessage };
    }

    const response = await res.json();

    return response;
  } catch {
    return { success: false, message: "Network error" };
  }
}
