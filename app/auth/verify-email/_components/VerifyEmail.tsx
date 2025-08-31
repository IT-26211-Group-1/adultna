"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { verifyEmailSchema } from "@/validators/authSchema";
import { useFormSubmit } from "@/hooks/useForm";
import { LoadingButton } from "@/components/ui/Button";

type VerifyEmailFormType = { otp: string };

export default function VerifyEmailForm() {
  const router = useRouter();
  const [verificationToken, setVerificationToken] = useState<string | null>(
    null,
  );
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  // Load token from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("verificationToken");

    if (!storedToken) {
      router.replace("/register");

      return;
    }
    setVerificationToken(storedToken);
  }, [router]);

  const otp = watch("otp").split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const currentOtp = watch("otp").split("");

    currentOtp[index] = value;
    setValue("otp", currentOtp.join(""));
    if (value && index < 5) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasteData = e.clipboardData.getData("text").trim();

    if (!/^\d{6}$/.test(pasteData)) return;

    pasteData.split("").forEach((digit, index) => {
      if (inputsRef.current[index]) {
        inputsRef.current[index]!.value = digit;
      }
    });
    setValue("otp", pasteData);
  };

  const { loading, onSubmit } = useFormSubmit<VerifyEmailFormType>({
    apiUrl: "/api/auth/verify-email",
    schema: verifyEmailSchema,
    requireCaptcha: false,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "Email verified successfully", color: "success" },
      error: { title: "Verification failed", color: "danger" },
    },
    onSuccess: () => {
      localStorage.removeItem("verificationToken");
      router.push("/auth/login");
    },
  });

  const handleResendOtp = async () => {
    if (!verificationToken) return;
    try {
      setResending(true);
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationToken }),
      });

      const data = await res.json();

      addToast({
        title:
          data.message ||
          (res.ok ? "OTP sent successfully" : "Failed to resend OTP"),
        color: res.ok ? "success" : "danger",
      });
    } catch (err) {
      console.error("Resend OTP error:", err);
      addToast({ title: "Internal server error", color: "danger" });
    } finally {
      setResending(false);
    }
  };

  const handleFormSubmit = (data: VerifyEmailFormType) => {
    if (!verificationToken) {
      addToast({ title: "Verification token missing", color: "danger" });

      return;
    }
    onSubmit({ ...data, verificationToken } as any);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Verify Your Email
        </h2>

        <p className="text-center text-gray-600 mb-4">
          Enter the 6-digit code sent to your email
        </p>

        <div className="flex gap-3 justify-center mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el: HTMLInputElement | null): void => {
                inputsRef.current[index] = el;
              }}
              className="w-12 h-12 text-center border rounded-md text-lg font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              inputMode="numeric"
              maxLength={1}
              type="text"
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-sm text-red-500 text-center mb-3">
            {errors.otp.message}
          </p>
        )}

        <LoadingButton loading={loading} type="submit">
          Verify
        </LoadingButton>

        <p className="text-center text-sm text-gray-500 mt-4">
          Didn't receive a code?
          <button
            className="text-blue-600 underline cursor-pointer"
            type="button"
            disabled={resending || !verificationToken}
            onClick={handleResendOtp}
          >
            {resending ? "Resending..." : "Resend"}
          </button>
        </p>
      </form>
    </div>
  );
}
