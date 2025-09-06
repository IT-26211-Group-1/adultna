import { OnboardingData } from "@/types/onboarding";
import { apiFetch } from "@/utils/api";

export async function saveOnboardingData(data: OnboardingData) {
  const response = await apiFetch<{ message: string }>("/api/auth/onboarding", {
    method: "POST",
    body: JSON.stringify(data),
    credentials: "include",
  });

  if (!response.success) {
    throw new Error(response.message || "Failed to save onboarding data");
  }

  return response.data;
}
