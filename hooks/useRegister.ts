"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState, useRef, useCallback } from "react";
import { registerSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/toast";
import { RegisterResponse } from "@/types/auth";
import { useSecureStorage } from "@/hooks/useSecureStorage";

export function useRegister() {
  const router = useRouter();
  const { setSecureItem } = useSecureStorage();
  const [loading, setLoading] = useState(false);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    mode: "onTouched",
    reValidateMode: "onChange",
  });

  const handleCaptchaChange = useCallback((token: string | null) => {
    setCaptchaToken(token);
  }, []);

  const handleCaptchaExpired = useCallback(() => {
    setCaptchaToken(null);
  }, []);

  const onSubmit = handleSubmit(
    async (data: z.infer<typeof registerSchema>) => {
      setLoading(true);

      const controller = new AbortController();

      try {
        if (showCaptcha && !captchaToken) {
          addToast({
            title: "Please verify captcha",
            color: "warning",
          });
          setLoading(false);

          return;
        }

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API}/auth/register`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ ...data, token: captchaToken }),
            signal: controller.signal,
          },
        );

        const result: RegisterResponse = await res.json();

        if (!res.ok || !result.success) {
          const message = result.message || "Registration failed";

          addToast({
            title: "Registration Failed",
            description: message,
            color: "danger",
          });
          setLoading(false);

          return;
        }

        if (result.verificationToken) {
          setSecureItem("verification_token", result.verificationToken, 60);
        }

        // Store initial cooldown
        if (result.data?.cooldownLeft) {
          sessionStorage.setItem(
            "initial_resend_cooldown",
            JSON.stringify({
              cooldown: result.data.cooldownLeft,
              timestamp: Date.now(),
            }),
          );
        }

        addToast({
          title: "Registration Successful!",
          description: "Please check your email for verification",
          color: "success",
        });

        router.replace("/auth/verify-email");
      } catch (error: any) {
        addToast({
          title: "Error",
          description: error.message || "Something went wrong",
          color: "danger",
        });
      } finally {
        setLoading(false);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setCaptchaToken(null);
      }
    },
  );

  return {
    register,
    errors,
    loading,
    onSubmit,
    watch,
    showCaptcha,
    setShowCaptcha,
    recaptchaRef,
    handleCaptchaChange,
    handleCaptchaExpired,
  };
}
