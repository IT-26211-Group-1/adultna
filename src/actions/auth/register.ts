"use server";

import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";
import { revalidatePath } from "next/cache";

export const registerUser = async (form: z.infer<typeof registerSchema>) => {
  const parsed = registerSchema.safeParse(form);

  if (!parsed.success) {
    throw new Error("Invalid registration data");
  }

  const res = await fetch(
    "https://67qnvnqw6i.execute-api.ap-southeast-2.amazonaws.com/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...parsed.data, acceptedTerms: true }),
    }
  );

  const result = await res.json();

  if (!res.ok) {
    return {
      success: false,
      message: result?.message || "Registration failed",
    };
  }

  revalidatePath("/");

  return {
    success: true,
    data: result,
  };
};
