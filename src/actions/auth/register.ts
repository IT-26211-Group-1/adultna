"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/utils/apiClient/apiClient";
import { RegisterPayload, RegisterResponse } from "@/types/auth";

export const registerUser = async (
  payload: RegisterPayload
): Promise<RegisterResponse> => {
  try {
    const res = await apiFetch<{ message: string }>(
      "https://67qnvnqw6i.execute-api.ap-southeast-2.amazonaws.com/register",
      {
        method: "POST",
        body: JSON.stringify(payload),
      }
    );

    if (!res.success) {
      console.error("API error during registration:", res.message);
      return { success: false, message: res.message || "Registration failed" };
    }

    revalidatePath("/");

    return { success: true };
  } catch (error) {
    console.error("Unexpected error during registration:", error);
    return {
      success: false,
      message: "Something went wrong. Please try again.",
    };
  }
};
