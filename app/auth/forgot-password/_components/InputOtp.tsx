"use client";

import { useRef, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { AuthButton } from "../../register/_components/AuthButton";
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
  const [otpValue, setOtpValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormType>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: "" },
  });

  // Split OTP value into array of 6 digits
  const otpArray = otpValue.padEnd(6, " ").slice(0, 6).split("");

  // Auto-focus the hidden input when component mounts
  useEffect(() => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  }, []);

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 6);

    setOtpValue(cleanValue);
    setValue("otp", cleanValue);
    setFocusedIndex(Math.min(cleanValue.length, 5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otpValue.length > 0) {
      const newValue = otpValue.slice(0, -1);

      setOtpValue(newValue);
      setValue("otp", newValue);
      setFocusedIndex(Math.max(0, newValue.length));
    }
  };

  const handleBoxClick = (index: number) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setFocusedIndex(index);

      // If clicking on an earlier position, truncate the OTP to that position
      if (index < otpValue.length) {
        const newValue = otpValue.slice(0, index);

        setOtpValue(newValue);
        setValue("otp", newValue);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasteData)) {
      handleOtpChange(pasteData);
    }
  };

  const { loading, onSubmit } = useFormSubmit<OtpFormType>({
    apiUrl: `${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/forgot-password/verify-otp`,
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

      const res = await fetch(`${process.env.NEXT_PUBLIC_AUTH_SERVICE_URL}/forgot-password/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verificationToken: token, email }),
        credentials: "include",
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
      <div className="relative mb-6">
        {/* Hidden input for actual typing */}
        <input
          ref={hiddenInputRef}
          autoComplete="one-time-code"
          className="absolute opacity-0 pointer-events-none"
          inputMode="numeric"
          maxLength={6}
          type="text"
          value={otpValue}
          onChange={(e) => handleOtpChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
        />

        {/* Visual OTP boxes */}
        <div className="flex gap-3 justify-center">
          {otpArray.map((digit, index) => (
            <div
              key={index}
              aria-label={`OTP digit ${index + 1} of 6`}
              className={`
                w-14 h-14 
                border-2 rounded-xl 
                flex items-center justify-center 
                text-xl font-semibold
                cursor-pointer
                transition-all duration-200
                focus:outline-none focus:ring-2 focus:ring-[#3C5A3A]/30
                ${
                  focusedIndex === index
                    ? "border-[#3C5A3A] bg-[#3C5A3A]/5 ring-2 ring-[#3C5A3A]/20"
                    : digit.trim()
                      ? "border-[#3C5A3A] bg-[#3C5A3A]/10"
                      : "border-gray-300 bg-white hover:border-gray-400"
                }
              `}
              role="button"
              tabIndex={0}
              onClick={() => handleBoxClick(index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  handleBoxClick(index);
                }
              }}
            >
              {digit.trim() && <span className="text-gray-800">{digit}</span>}
              {focusedIndex === index && !digit.trim() && (
                <div className="w-0.5 h-6 bg-[#3C5A3A] animate-pulse" />
              )}
            </div>
          ))}
        </div>
      </div>

      {errors.otp && (
        <p className="text-red-500 text-center mb-4 text-sm">
          {errors.otp.message}
        </p>
      )}

      <AuthButton loading={loading} type="submit">
        Verify OTP
      </AuthButton>

      <ResendTimer
        handleResendOtp={handleResendOtp}
        resending={resending}
        verificationToken={token}
      />
    </form>
  );
}
