"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAdminAuth } from "@/hooks/useAdminAuth";

export function useAdminLogin() {
  const router = useRouter();
  const { login, isLoggingIn } = useAdminAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit = handleSubmit(async (data: z.infer<typeof loginSchema>) => {
    login(data, {
      onSuccess: (response) => {
        if (response.success) {
          addToast({
            title: "Admin Login Successful!",
            color: "success",
          });

          setTimeout(() => {
            router.replace("/admin/dashboard");
          }, 300);
        }
      },
      onError: (error: any) => {
        console.log("Admin login error:", error);

        if (error?.message?.includes("Too many failed attempts")) {
          addToast({
            title: "Login failed",
            description: error.message,
            color: "danger",
          });
        } else if (error?.message?.includes("attempt(s) remaining")) {
          addToast({
            title: "Login failed",
            description: error.message,
            color: "danger",
          });
        } else if (error?.message?.includes("Invalid credentials")) {
          addToast({
            title: "Login failed",
            description: "Invalid email or password",
            color: "danger",
          });
        } else if (error?.message?.includes("Account is not active")) {
          addToast({
            title: "Access denied",
            description: "Your admin account has been deactivated",
            color: "danger",
          });
        } else if (
          error?.message?.includes("Technical admin privileges required")
        ) {
          addToast({
            title: "Access denied",
            description: "This area is restricted to technical administrators",
            color: "danger",
          });
        } else {
          addToast({
            title: "Login failed",
            description: error?.message || "Something went wrong",
            color: "danger",
          });
        }
      },
    });
  });

  return {
    register,
    errors,
    loading: isLoggingIn,
    onSubmit,
  };
}
