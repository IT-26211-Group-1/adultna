"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addToast } from "@heroui/react";
import { LoadingButton } from "@/components/ui/Button";
import { useFormSubmit } from "@/hooks/useForm";
import { forgotPasswordSchema } from "@/validators/authSchema";

interface Props {
  email: string;
  setEmail: (email: string) => void;
  setStep: (step: "email" | "otp" | "reset") => void;
  setToken: (token: string) => void;
}

type EmailFormType = { email: string };

export default function InputEmail({ setStep, setToken }: Props) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<EmailFormType>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
    mode: "onBlur",
  });

  const { loading, onSubmit } = useFormSubmit<EmailFormType>({
    apiUrl: "/api/auth/forgot-password/send-otp",
    schema: forgotPasswordSchema,
    requireCaptcha: false,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "OTP sent to your email", color: "success" },
      error: { title: "Error sending OTP", color: "danger" },
    },
    onSuccess: (data) => {
      const { verificationToken } = data as { verificationToken: string };
      setToken(verificationToken);
      setStep("otp");
    },
  });

  const handleFormSubmit = (data: EmailFormType) => {
    sessionStorage.setItem("forgotPasswordEmail", data.email);
    onSubmit(data);
  };

  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <h2 className="text-2xl font-semibold text-center">Forgot Password</h2>
      <input
        type="email"
        {...register("email")}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="Enter your email"
      />
      <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
      <LoadingButton loading={loading} type="submit">
        Send OTP
      </LoadingButton>
    </form>
  );
}
