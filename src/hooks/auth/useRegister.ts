// services/auth/useRegister.ts
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { registerUser } from "@/services/auth/registerService"; // Import the pure service function
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";

type RegisterData = z.infer<typeof registerSchema>;

export const useRegister = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData) => {
    setLoading(true);
    setError(null);

    try {
      await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        acceptedTerms: true,
      });

      alert("Registration successful!");
      //   router.push("/login");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { register, loading, error };
};
