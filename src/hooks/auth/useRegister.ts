"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { registerSchema } from "@/validators/auth/registerSchema";

export const useRegister = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const register = async (data: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError("");

    try {
      console.log("Registering user with:", data);
      const res = await fetch(
        "https://s4xhwjy4m1.execute-api.ap-southeast-2.amazonaws.com/register",
        {
          method: "POST",
          body: JSON.stringify(data),
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
