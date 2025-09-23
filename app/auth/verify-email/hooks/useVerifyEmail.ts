"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { verifyEmailSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useEmailVerification } from "@/hooks/useAuth";
import { useSecureStorage } from "@/hooks/useSecureStorage";

export function useVerifyEmail() {
  const router = useRouter();
  const { verifyEmail, resendOtp, isVerifying, isResending } = useEmailVerification();
  const { getSecureItem, removeSecureItem } = useSecureStorage();
  const [verificationToken, setVerificationToken] = useState<string | null>(null);

  // Check for verification token on mount
  useEffect(() => {
    const token = getSecureItem("verification_token");
    setVerificationToken(token);

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
              description: error?.message || "Please check your code and try again",
              color: "danger",
            });
          },
        }
      );
    },
    [verifyEmail, getSecureItem, router]
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

    return new Promise((resolve) => {
      resendOtp(
        { verificationToken: currentToken },
        {
          onSuccess: () => {
            addToast({
              title: "OTP sent successfully",
              color: "success",
            });
            resolve(60); // Default cooldown
          },
          onError: (error: any) => {
            addToast({
              title: "Failed to resend OTP",
              description: error?.message || "Please try again",
              color: "danger",
            });
            resolve(120); // Error cooldown
          },
        }
      );
    });
  }, [resendOtp, getSecureItem, router]);

  return {
    loading: isVerifying,
    resending: isResending,
    verificationToken: verificationToken ? "present" : null,
    handleFormSubmit: handleVerifyEmail,
    resendOtp: handleResendOtp,
    resendCooldown: 0, // Managed by the query hook now
  };
}
