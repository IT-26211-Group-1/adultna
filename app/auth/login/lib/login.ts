import { LoginResponse } from "@/types/auth";
import { loginSchema } from "@/validators/authSchema";

export async function loginRequest(data: unknown): Promise<LoginResponse> {
  const parsed = loginSchema.parse(data);

  const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(parsed),
    credentials: "include",
  });

  if (!res.ok) {
    throw await res.json();
  }

  const response = await res.json();

  if (response.success && response.accessToken) {
    const accessTokenExpiry = response.accessTokenExpiresAt
      ? new Date(response.accessTokenExpiresAt)
      : new Date(Date.now() + 15 * 60 * 1000);

    const refreshTokenExpiry = response.refreshTokenExpiresAt
      ? new Date(response.refreshTokenExpiresAt)
      : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Set access token cookie
    document.cookie = `access_token=${response.accessToken}; expires=${accessTokenExpiry.toUTCString()}; path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`;

    // Set refresh token cookie
    if (response.refreshToken) {
      document.cookie = `refresh_token=${response.refreshToken}; expires=${refreshTokenExpiry.toUTCString()}; path=/; SameSite=Lax; ${process.env.NODE_ENV === "production" ? "Secure;" : ""}`;
    }
  }

  return response;
}
