"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyEmailSchema } from "@/validators/authSchema";
import { AuthButton } from "../../register/_components/AuthButton";
import { ResendTimer } from "@/components/ui/ResendTimer";
import { useVerifyEmail } from "../hooks/useVerifyEmail";
import { OTPInput } from "./OTPInput";

type VerifyEmailFormType = { otp: string };

export const VerifyEmailForm = () => {
  const [otpValue, setOtpValue] = useState("");

  const {
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailFormType>({
    resolver: zodResolver(verifyEmailSchema),
    defaultValues: { otp: "" },
  });

  const {
    loading,
    resending,
    verificationToken,
    handleFormSubmit,
    resendOtp,
    resendCooldown,
  } = useVerifyEmail();

  const handleOtpChange = (value: string) => {
    setOtpValue(value);
    setValue("otp", value);
  };

  const onFormSubmit = (data: VerifyEmailFormType) => {
    handleFormSubmit(data.otp);
  };

  return (
    <form
      className="w-full max-w-md mx-auto p-6 rounded-lg"
      onSubmit={handleSubmit(onFormSubmit)}
    >
      <OTPInput value={otpValue} onChange={handleOtpChange} />

      {errors.otp && (
        <p className="text-red-500 text-center mb-4 text-sm">
          {errors.otp.message}
        </p>
      )}

      <AuthButton loading={loading} type="submit">
        Verify
      </AuthButton>

      <ResendTimer
        cooldown={resendCooldown}
        handleResendOtp={resendOtp}
        resending={resending}
        verificationToken={verificationToken}
      />
    </form>
  );
};
