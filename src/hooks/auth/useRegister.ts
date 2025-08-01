"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";
import { registerUser } from "@/actions/auth/register";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (form: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError("");
    const result = await registerUser(form);

    if (!result.success) {
      setError(result.message);

      if (result.message === "Email is already registered") {
        alert("Email is already registered");
      }

      setLoading(false);
      return;
    }

    alert("Registration Successful");
    // router.push("/dashboard");
    setLoading(false);
  };

  return { register, error, loading };
};
