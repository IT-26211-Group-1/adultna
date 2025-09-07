"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { LoadingButton } from "@/components/ui/Button";
import { useFormSubmit } from "@/hooks/useForm";
import { forgotPasswordOtpSchema } from "@/validators/authSchema";
import { ResendTimer } from "@/components/ui/ResendTimer";

interface InputOtpProps {
  token: string;
  email: string;
  setStep: React.Dispatch<React.SetStateAction<"email" | "otp" | "reset">>;
}

type OtpFormType = { otp: string };

export default function InputOtp({ token, setStep }: InputOtpProps) {
  const [resending, setResending] = useState(false);
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OtpFormType>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: "" },
  });

  const otpString = watch("otp") as string;
  const otp = otpString.split("").concat(Array(6).fill("")).slice(0, 6);

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const currentOtp = (watch("otp") as string).split("");

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
    pasteData.split("").forEach((digit, i) => {
      if (inputsRef.current[i]) inputsRef.current[i]!.value = digit;
    });
    setValue("otp", pasteData);
  };

  const { loading, onSubmit } = useFormSubmit<OtpFormType>({
    apiUrl: "/api/auth/forgot-password/verify-otp",
    schema: forgotPasswordOtpSchema,
    requireCaptcha: false,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "OTP verified successfully", color: "success" },
      error: { title: "OTP verification failed", color: "danger" },
    },
    onSuccess: () => setStep("reset"),
  });

  const handleResendOtp = async () => {
    try {
      const email = sessionStorage.getItem("forgotPasswordEmail");

      if (!email) {
        addToast({ title: "Email is missing", color: "danger" });

        return;
      }

      setResending(true);

      const res = await fetch("/api/auth/forgot-password/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationToken: token, email }),
      });

      const data = await res.json();

      addToast({
        title: data.message || (res.ok ? "OTP sent" : "Failed to resend"),
        color: res.ok ? "success" : "danger",
      });

      return data.cooldownLeft ?? 120;
    } catch (err) {
      console.error("Resend OTP error:", err);
      addToast({ title: "Internal server error", color: "danger" });
    } finally {
      setResending(false);
    }
  };

  const handleFormSubmit = (data: OtpFormType) => {
    onSubmit({ ...data, verificationToken: token } as unknown as OtpFormType & {
      verificationToken: string;
    });
  };

  return (
    <form
      className="w-full max-w-md mx-auto p-6 rounded-lg"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <h2 className="text-xl font-semibold text-center mb-4">Enter OTP</h2>
      <div className="flex gap-2 justify-center mb-4">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={(el) => {
              inputsRef.current[i] = el;
            }}
            className="w-12 h-12 text-center border rounded-md text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            inputMode="numeric"
            maxLength={1}
            type="text"
            value={digit}
            onChange={(e) => handleChange(e.target.value, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
          />
        ))}
      </div>
      {errors.otp && (
        <p className="text-red-500 text-center mb-2">{errors.otp.message}</p>
      )}
      <LoadingButton className="w-full mb-2" loading={loading} type="submit">
        Verify OTP
      </LoadingButton>

      <ResendTimer
        handleResendOtp={handleResendOtp}
        resending={resending}
        verificationToken={token}
      />
    </form>
  );
}
