"use server";

import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";
import { revalidatePath } from "next/cache";
import { apiFetch } from "@/utils/apiClient/apiClient";

export const registerUser = async (form: z.infer<typeof registerSchema>) => {
  const parsed = registerSchema.safeParse(form);

  if (!parsed.success) {
    throw new Error("Invalid registration data");
  }

  const payload = {
    ...parsed.data,
    acceptedTerms: true,
  };

  const res = await apiFetch<{ message: string }>(
    "https://67qnvnqw6i.execute-api.ap-southeast-2.amazonaws.com/register",
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );

  if (!res.success) {
    return { success: false, message: res.message };
  }

  revalidatePath("/");

  return { success: true };
};
