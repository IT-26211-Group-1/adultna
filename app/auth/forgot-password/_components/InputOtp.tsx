"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { AuthButton } from "../../register/_components/AuthButton";
import { useForgotPasswordFlow } from "@/hooks/queries/useForgotPasswordQueries";
import { forgotPasswordOtpSchema } from "@/validators/authSchema";
import { ResendTimer } from "@/components/ui/ResendTimer";

type OtpFormType = { otp: string };

export default function InputOtp() {
  const {
    verifyOtp,
    resendOtp,
    isVerifyingOtp,
    isResendingOtp,
    getStoredToken,
    getStoredEmail,
  } = useForgotPasswordFlow();
  const [otpValue, setOtpValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<OtpFormType>({
    resolver: zodResolver(forgotPasswordOtpSchema),
    defaultValues: { otp: "" },
  });

  // Split OTP inpuit
  const otpArray = otpValue.padEnd(6, " ").slice(0, 6).split("");

  if (!initialized.current && hiddenInputRef.current) {
    initialized.current = true;
    hiddenInputRef.current.focus();
  }

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

  const handleResendOtp = async (): Promise<number> => {
    const email = getStoredEmail();

    if (!email) {
      addToast({ title: "Email is missing", color: "danger" });

      return 120;
    }

    return new Promise((resolve) => {
      resendOtp(undefined, {
        onSuccess: () => {
          addToast({
            title: "OTP sent to your email",
            color: "success",
          });
          resolve(120);
        },
        onError: (error) => {
          addToast({
            title: "Failed to resend OTP",
            description: error?.message || "Please try again",
            color: "danger",
          });
          resolve(120);
        },
      });
    });
  };

  const handleFormSubmit = (data: OtpFormType) => {
    const token = getStoredToken();

    if (!token) {
      addToast({ title: "Verification token is missing", color: "danger" });

      return;
    }

    verifyOtp({ otp: data.otp, verificationToken: token });
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

      <AuthButton loading={isVerifyingOtp} type="submit">
        Verify OTP
      </AuthButton>

      <ResendTimer
        handleResendOtp={handleResendOtp}
        resending={isResendingOtp}
        verificationToken={getStoredToken() || ""}
      />
    </form>
  );
}
