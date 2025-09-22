"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useAuthContext } from "@/providers/AuthProvider";
import { TOO_MANY_REQUESTS, UNAUTHORIZED } from "@/constants/http";
import { ResendOtpResponse, VerifyEmailResponse } from "@/types/auth";

export function useVerifyEmail() {
  const router = useRouter();
  const { forceAuthCheck } = useAuthContext();
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null
  );
  const mountedRef = useRef(true);
  const [verifyCooldown, setVerifyCooldown] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check for verification token on mount
  useEffect(() => {
    const token = sessionStorage.getItem("verification_token");
    setVerificationToken(token);

    if (!token) {
      setLoading(true);
      router.replace("/auth/register");
      return;
    }

    setLoading(false);
  }, [router]);

  // Simple countdown timer for cooldowns
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (verifyCooldown > 0 || resendCooldown > 0) {
      interval = setInterval(() => {
        setVerifyCooldown((c) => Math.max(0, c - 1));
        setResendCooldown((c) => Math.max(0, c - 1));
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [verifyCooldown, resendCooldown]);

  const generateRequestIntegrity = () => {
    const timestamp = Date.now();
    const userAgent = navigator.userAgent;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;

    const fingerprint = btoa(
      `${userAgent.slice(0, 50)}-${timezone}-${language}`
    ).slice(0, 16);

    return { timestamp, fingerprint, timezone };
  };

  const verifyEmail = useCallback(
    async (otp: string) => {
      const currentToken = sessionStorage.getItem("verification_token");
      setVerificationToken(currentToken);

      if (!currentToken) {
        return router.replace("/auth/register");
      }

      if (verifyCooldown > 0) {
        addToast({
          title: `Please wait ${verifyCooldown}s before trying again`,
          color: "warning",
        });

        return;
      }

      const parsed = verifyEmailSchema.safeParse({ otp });

      if (!parsed.success) {
        addToast({
          title: parsed.error.issues[0]?.message || "Invalid verification code",
          color: "danger",
        });

        return;
      }

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000);

      try {
        setLoading(true);
        setError(null);

        const integrity = generateRequestIntegrity();

        const requestBody = {
          otp,
          verificationToken: currentToken,
          ...integrity,
        };

        const res = await fetch(
          `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/verify-email`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "X-Request-Timestamp": integrity.timestamp.toString(),
              "X-Request-Fingerprint": integrity.fingerprint,
            },
            credentials: "include",
            signal: controller.signal,
            body: JSON.stringify(requestBody),
          }
        );

        clearTimeout(timeout);

        const result: VerifyEmailResponse = await res.json();

        if (!res.ok || !result.success) {
          const message =
            res.status === TOO_MANY_REQUESTS
              ? "Too many attempts. Please try again later."
              : res.status === UNAUTHORIZED
                ? "Invalid verification code. Please try again."
                : result.message || "Verification failed";

          setError(message);
          addToast({ title: message, color: "danger" });

          if (res.status === TOO_MANY_REQUESTS) {
            setVerifyCooldown(result.cooldownLeft ?? 30);
          }

          return;
        }

        addToast({
          title: result.message || "Email verified successfully",
          color: "success",
        });

        sessionStorage.removeItem("verification_token");

        await forceAuthCheck();
        router.push("/auth/onboarding");
      } catch (err: any) {
        let errorMessage = "Verification failed. Please try again.";

        if (err.name === "AbortError") {
          errorMessage = "Request timed out. Please try again.";
        }
        addToast({ title: errorMessage, color: "danger" });
      } finally {
        if (mountedRef.current) {
          setLoading(false);
        }
      }
    },
    [router, verificationToken, verifyCooldown, forceAuthCheck]
  );

  const resendOtp = useCallback(async (): Promise<number> => {
    if (!mountedRef.current) {
      return 120;
    }

    if (resendCooldown > 0) {
      addToast({
        title: `Please wait ${resendCooldown}s before resending`,
        color: "warning",
      });

      return resendCooldown;
    }

    const currentToken = sessionStorage.getItem("verification_token");
    if (!currentToken) {
      addToast({
        title: "No verification session found",
        color: "danger",
      });
      router.replace("/auth/register");
      return 120;
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      setResending(true);
      setError(null);

      const integrity = generateRequestIntegrity();

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/resend-otp`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Request-Timestamp": integrity.timestamp.toString(),
            "X-Request-Fingerprint": integrity.fingerprint,
          },
          credentials: "include",
          signal: controller.signal,
          body: JSON.stringify({
            verificationToken: currentToken,
            ...integrity,
          }),
        }
      );

      clearTimeout(timeout);

      const result: ResendOtpResponse = await res.json();

      if (!res.ok || !result.success) {
        const message =
          res.status === TOO_MANY_REQUESTS
            ? "Too many requests. Please try again later."
            : result.message || "Failed to resend code";

        addToast({ title: message, color: "danger" });

        if (res.status === TOO_MANY_REQUESTS) {
          setResendCooldown(result.data?.cooldownLeft ?? 60);
        }

        return 120;
      }

      addToast({
        title: result.message || "OTP sent successfully",
        color: "success",
      });

      // Update verification token if provided
      if (result.verificationToken) {
        sessionStorage.setItem("verification_token", result.verificationToken);
        setVerificationToken(result.verificationToken);
      }

      const cooldown = result.data?.cooldownLeft ?? 60;

      setResendCooldown(cooldown);

      return cooldown;
    } catch {
      addToast({
        title: "Failed to resend OTP",
        color: "danger",
      });

      return 120;
    } finally {
      if (mountedRef.current) {
        setResending(false);
      }
    }
  }, [resendCooldown]);

  return {
    loading,
    resending,
    error,
    verificationToken: verificationToken ? "present" : null,
    verifyEmail,
    handleFormSubmit: verifyEmail,
    resendOtp,
    verifyCooldown,
    resendCooldown,
  };
}
