"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { addToast } from "@heroui/react";
import { apiFetch } from "@/utils/api";
import { verifyEmailSchema } from "@/validators/authSchema";

type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  if (!email) return router.push("/register");

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
    index: number
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const onSubmit = async (data: VerifyEmailInput) => {
    if (!email) {
      addToast({
        title: "Email is missing",
        color: "danger",
        timeout: 5000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await apiFetch<{ success: boolean; message: string }>(
        "/api/auth/verify-email",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, otp: data.otp }),
        }
      );

      if (!response.success) {
        addToast({
          title: response.message || "Verification failed",
          color: "danger",
          timeout: 5000,
        });
        return;
      }

      addToast({
        title: response.message || "Email verified successfully",
        color: "success",
      });

      router.push("/login");
    } catch {
      addToast({
        title: "Something went wrong. Please try again.",
        color: "danger",
        timeout: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">
          Verify Email
        </h2>

        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputsRef.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className="w-10 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        {errors.otp && (
          <p className="text-sm text-red-500 text-center">
            {errors.otp.message}
          </p>
        )}

        <button
          type="submit"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
          disabled={loading}
        >
          {loading && (
            <svg
              className="w-4 h-4 animate-spin text-white"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                fill="currentColor"
              />
            </svg>
          )}
          <span>Verify</span>
        </button>
      </form>
    </div>
  );
}
