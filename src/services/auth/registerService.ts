import { ApiResponse, RegisterPayload } from "@/types/auth";
import { apiFetch } from "@/utils/api";

export async function registerUser(
  data: RegisterPayload
): Promise<ApiResponse<RegisterPayload>> {
  const response = await apiFetch<RegisterPayload>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return {
    ...response,
    message: response.message || "",
  };
}
