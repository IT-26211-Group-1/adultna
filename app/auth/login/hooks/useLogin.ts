"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { loginRequest } from "../lib/login";
import { useState } from "react";
import { useAuthContext } from "@/providers/AuthProvider";

export function useLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { forceAuthCheck } = useAuthContext();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data: z.infer<typeof loginSchema>) => {
    setLoading(true);

    try {
      const response = await loginRequest(data);

      if (response.success) {
        addToast({
          title: "Login Successful!",
          color: "success",
        });

        // Wait for auth check to complete before navigation
        const authResult = await forceAuthCheck();

        if (authResult) {
          // Use setTimeout to ensure navigation happens after auth state update
          setTimeout(() => {
            router.replace("/dashboard");
          }, 100);
        } else {
          setTimeout(() => {
            window.location.href = "/dashboard";
          }, 200);
        }
      } else {
        throw response;
      }
    } catch (error: any) {
      if (error.needsVerification) {
        addToast({
          title: "Email not verified",
          description: "Check your inbox for the OTP",
          color: "warning",
        });
        router.replace("/auth/verify-email");

        return;
      }

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
  });

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch("/api/auth/google");
      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      } else {
        addToast({
          title: "Error",
          description: "Unable to initiate Google login",
          color: "danger",
        });
      }
    } catch (error) {
      addToast({
        title: "Error",
        description: "Failed to connect to Google login",
        color: "danger",
      });
    }
  };

  return {
    register,
    errors,
    loading,
    onSubmit,
    handleGoogleLogin,
  };
}
