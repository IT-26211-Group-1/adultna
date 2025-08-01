"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";
import { registerUser } from "@/actions/auth/register";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  const register = async (form: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError("");
    const result = await registerUser(form);

    if (!result.success) {
      setError(result.message || "Registration Failed");
      setLoading(false);
      return;
    }

    setSuccess(true);
    // router.push("/");
    setLoading(false);
  };

  return { register, error, loading, success };
};
