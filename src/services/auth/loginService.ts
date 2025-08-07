import { LoginPayload } from "@/types/auth";
import { ApiResponse } from "@/types/auth";

export const loginUser = async (
  data: LoginPayload
): Promise<ApiResponse<any>> => {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || "Login failed.");
  }

  return result;
};
