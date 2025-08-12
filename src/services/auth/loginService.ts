import { ApiResponse, LoginPayload } from "@/types/auth";
import { apiFetch } from "@/utils/api";

export async function loginUser(
  data: LoginPayload
): Promise<ApiResponse<LoginPayload>> {
  const response = await apiFetch<LoginPayload>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(data),
  });

  return {
    ...response,
    message: response.message || "",
  };
}
