"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/auth/loginService";
import { z } from "zod";
import { loginSchema } from "@/validators/auth/loginSchema";

// Derive the TypeScript type from the Zod schema for type safety
type LoginData = z.infer<typeof loginSchema>;

export const useLogin = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData) => {
    setLoading(true);
    setError(null);

    try {
      const res = await loginUser(data);

      alert("Login Successful");
      router.push("/");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  return { login, loading, error };
};
