"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { LoginPayload, LoginResponse } from "@/types/auth";
import { addToast } from "@heroui/react";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = async (payload: LoginPayload) => {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data: LoginResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      if (data.needsVerification) {
        addToast({
          title: "Email not verified",
          description: "Check your inbox for the OTP",
          color: "warning",
        });
        router.replace("/auth/verify-email");
        return;
      }

      // Store tokens if login successful
      if (data.accessToken) {
        sessionStorage.setItem("accessToken", data.accessToken);
        if (data.refreshToken) {
          sessionStorage.setItem("refreshToken", data.refreshToken);
        }
      }

      addToast({
        title: "Login Successful!",
        color: "success",
      });
      router.replace("/dashboard");
    } catch (error: any) {
      const message = error.message || "Invalid email or password";

      setError("email", { type: "manual", message });

      addToast({
        title: "Login Failed",
        description: message,
        color: "danger",
      });
    } finally {
      setLoading(false);
    }
  };

  return { register, handleSubmit, errors, onSubmit, loading };
}
