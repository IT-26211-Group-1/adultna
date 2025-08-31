"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { ZodType } from "zod";

export type ToastOptions = {
  title?: string;
  color?: "success" | "danger" | "primary" | "secondary" | "warning";
  timeout?: number;
};

interface UseFormOptions<T> {
  apiUrl: string;
  schema: ZodType<T>;
  redirectOnSuccess?: string | ((response: any) => string);
  onSuccess?: (response: any) => void;
  onError?: (error: string) => void;
  showToast?: boolean;
  toastLib?: { addToast: (options: ToastOptions) => void };
  toastMessages?: {
    success?: ToastOptions;
    error?: ToastOptions;
    captcha?: ToastOptions;
  };
}

export const useFormSubmit = <T extends object>({
  apiUrl,
  schema,
  redirectOnSuccess,
  onSuccess,
  onError,
  showToast = true,
  toastLib,
  toastMessages = {},
  requireCaptcha = true,
}: UseFormOptions<T> & { requireCaptcha?: boolean }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<any>(null);

  const handleCaptchaChange = (token: string | null) => setCaptchaToken(token);
  const handleCaptchaExpired = () => setCaptchaToken(null);

  const onSubmit = async (data: T) => {
    const parsed = schema.safeParse(data);

    if (!parsed.success) {
      const firstErrorMessage =
        parsed.error.issues[0]?.message || "Invalid input";

      setError(firstErrorMessage);
      onError?.(firstErrorMessage);

      if (showToast && toastLib) {
        toastLib.addToast({
          title: firstErrorMessage,
          color: toastMessages.error?.color || "danger",
        });
      }

      return;
    }

    if (requireCaptcha && !captchaToken) {
      if (showToast && toastLib) {
        toastLib.addToast({
          title: toastMessages.captcha?.title || "Please verify captcha",
          color: toastMessages.captcha?.color || "danger",
        });
      }

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, token: captchaToken }),
      });

      const result = await res.json();

      if (!res.ok || result?.success === false) {
        const message =
          result?.message || toastMessages.error?.title || "Request failed";

        setError(message);
        onError?.(message);
        if (showToast && toastLib) {
          toastLib.addToast({
            title: message,
            color: toastMessages.error?.color || "danger",
          });
        }

        return;
      }

      onSuccess?.(result);

      if (redirectOnSuccess) {
        const redirectUrl =
          typeof redirectOnSuccess === "function"
            ? redirectOnSuccess(result)
            : redirectOnSuccess;

        router.push(redirectUrl);
      }

      if (showToast && toastLib) {
        toastLib.addToast({
          title:
            result?.message ||
            toastMessages.success?.title ||
            "Request successful!",
          color: toastMessages.success?.color || "success",
        });
      }
    } catch {
      const errorMessage = toastMessages.error?.title || "Something went wrong";

      setError(errorMessage);
      onError?.(errorMessage);
      if (showToast && toastLib) {
        toastLib.addToast({
          title: errorMessage,
          color: toastMessages.error?.color || "danger",
        });
      }
    } finally {
      setLoading(false);
      if (recaptchaRef.current) recaptchaRef.current.reset();
      setCaptchaToken(null);
    }
  };

  return {
    loading,
    error,
    captchaToken,
    recaptchaRef,
    handleCaptchaChange,
    handleCaptchaExpired,
    onSubmit,
  };
};
