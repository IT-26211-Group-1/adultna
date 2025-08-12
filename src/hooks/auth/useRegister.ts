"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth/registerService";
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";

type RegisterData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = useCallback(
    async (data: RegisterData) => {
      setLoading(true);
      setError(null);

      try {
        await registerUser({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: data.password,
          acceptedTerms: data.acceptedTerms,
        });

        router.push("/login");
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError("An unexpected error occurred");
        }
      } finally {
        setLoading(false);
      }
    },
    [router]
  );

  return { register, loading, error };
};
