"use client";

import { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/validators/authSchema";
import { LoadingButton } from "@/components/ui/Button";
import { ResendTimer } from "@/components/ui/ResendTimer";
import { useVerifyEmail } from "../hooks/useVerifyEmail";

type VerifyEmailFormType = { otp: string };

export default function VerifyEmailForm() {
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

  const { loading, resending, verificationToken, handleFormSubmit, resendOtp } =
    useVerifyEmail();

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

  const onFormSubmit = (data: VerifyEmailFormType) => {
    handleFormSubmit(data.otp);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <form
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-md"
        onSubmit={handleSubmit(onFormSubmit)}
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

        <ResendTimer
          handleResendOtp={resendOtp}
          resending={resending}
          verificationToken={verificationToken}
        />
      </form>
    </div>
  );
}
