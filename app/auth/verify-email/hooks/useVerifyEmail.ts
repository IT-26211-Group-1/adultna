"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useEmailVerification } from "@/hooks/useAuth";
import { useSecureStorage } from "@/hooks/useSecureStorage";

export function useVerifyEmail() {
  const router = useRouter();
  const { verifyEmail, resendOtpAsync, isVerifying, isResending } =
    useEmailVerification();
  const { getSecureItem } = useSecureStorage();
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [initialCooldown, setInitialCooldown] = useState<number>(0);

  useEffect(() => {
    const token = getSecureItem("verification_token");

    setVerificationToken(token);

    const cooldownData = sessionStorage.getItem("initial_resend_cooldown");

    if (cooldownData) {
      try {
        const { cooldown, timestamp } = JSON.parse(cooldownData);
        const elapsed = Math.floor((Date.now() - timestamp) / 1000);
        const remaining = Math.max(0, cooldown - elapsed);

        if (remaining > 0) {
          setInitialCooldown(remaining);
        }

        sessionStorage.removeItem("initial_resend_cooldown");
      } catch (error) {
        console.warn("Failed to parse initial cooldown:", error);
        sessionStorage.removeItem("initial_resend_cooldown");
      }
    }

    if (!token) {
      addToast({
        title: "No verification session found",
        description: "Please register again",
        color: "warning",
      });
      router.replace("/auth/register");
    }
  }, [router, getSecureItem]);

  const handleVerifyEmail = useCallback(
    (otp: string) => {
      const currentToken = getSecureItem("verification_token");

      if (!currentToken) {
        addToast({
          title: "No verification session found",
          color: "danger",
        });
        router.replace("/auth/register");

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

      verifyEmail(
        { otp, verificationToken: currentToken },
        {
          onSuccess: () => {
            addToast({
              title: "Email verified successfully",
              color: "success",
            });
            setTimeout(() => {
              router.push("/auth/onboarding");
            }, 1000);
          },
          onError: (error: any) => {
            addToast({
              title: "Verification failed",
              description:
                error?.message || "Please check your code and try again",
              color: "danger",
            });
          },
        },
      );
    },
    [verifyEmail, getSecureItem, router],
  );

  const handleResendOtp = useCallback(async (): Promise<number> => {
    const currentToken = getSecureItem("verification_token");

    if (!currentToken) {
      addToast({
        title: "No verification session found",
        color: "danger",
      });
      router.replace("/auth/register");

      return 120;
    }

    try {
      await resendOtpAsync({
        verificationToken: currentToken,
      });

      addToast({
        title: "OTP sent successfully",
        color: "success",
      });

      return 60;
    } catch (error: any) {
      if (error?.data?.cooldownLeft) {
        addToast({
          title: "Please wait before resending",
          description: `You can resend OTP in ${error.data.cooldownLeft} seconds`,
          color: "warning",
        });

        return error.data.cooldownLeft;
      }

      addToast({
        title: "Failed to resend OTP",
        description: error?.message || "Please try again",
        color: "danger",
      });

      return 120;
    }
  }, [resendOtpAsync, getSecureItem, router]);

  return {
    loading: isVerifying,
    resending: isResending,
    verificationToken: verificationToken ? "present" : null,
    handleFormSubmit: handleVerifyEmail,
    resendOtp: handleResendOtp,
    resendCooldown: initialCooldown,
  };
}
