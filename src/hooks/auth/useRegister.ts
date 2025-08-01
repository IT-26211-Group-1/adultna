"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const register = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        "https://67qnvnqw6i.execute-api.ap-southeast-2.amazonaws.com/register",
        {
          method: "POST",
          body: JSON.stringify({
            ...data,
            acceptedTerms: true,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await res.json();

      if (!res.ok) {
        setError(result.message || "Registration failed");
        if (result.message === "Email is already registered") {
          alert("Email is already registered!");
        }
      } else {
        // router.push("/dashboard");
        alert("Success");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { register, error, loading };
};
