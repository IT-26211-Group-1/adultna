"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { useSecureStorage } from "@/hooks/useSecureStorage";

export function useLogin() {
  const router = useRouter();
  const { login, isLoggingIn } = useAuth();
  const { setSecureItem } = useSecureStorage();

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
            title: "Login Successful!",
            color: "success",
          });

          // Wait for auth state to update, then navigate
          setTimeout(() => {
            router.replace("/dashboard");
          }, 300);
        } else if (response.verificationToken) {
          addToast({
            title: "Email not verified",
            description: "Check your inbox for the OTP",
            color: "warning",
          });

          setSecureItem(
            "verification_token",
            response.verificationToken,
            60 // 1 hour expiry
          );

          router.replace("/auth/verify-email");
        }
      },
      onError: (error: any) => {
        if (error?.message === "Please verify your email first") {
          addToast({
            title: "Email not verified",
            description: "Check your inbox for the OTP",
            color: "warning",
          });

          // Store initial cooldown
          if (error?.data?.cooldownLeft) {
            sessionStorage.setItem(
              "initial_resend_cooldown",
              JSON.stringify({
                cooldown: error.data.cooldownLeft,
                timestamp: Date.now(),
              })
            );
          }
        } else {
          addToast({
            title: "Something went wrong",
            color: "danger",
          });
        }
      },
    });
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
    } catch {
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
    loading: isLoggingIn,
    onSubmit,
    handleGoogleLogin,
  };
}
