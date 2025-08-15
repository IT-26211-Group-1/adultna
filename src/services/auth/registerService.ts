import { ApiResponse, RegisterPayload } from "@/types/auth";
import { apiFetch } from "@/utils/api";

export async function registerUser(
  data: RegisterPayload
): Promise<ApiResponse<RegisterPayload>> {
  const response = await apiFetch<RegisterPayload>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  if (!response.success) {
    throw new Error(response.message ?? "Registration failed");
  }

  return {
    ...response,
    message: response.message ?? "",
  };
}
