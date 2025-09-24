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

  const response = await res.json();

  if (!res.ok) {
    if (res.status === 401 && response.verificationToken) {
      return response;
    }
    throw response;
  }

  return response;
}
