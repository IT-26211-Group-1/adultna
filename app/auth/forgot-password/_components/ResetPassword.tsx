"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { LoadingButton } from "@/components/ui/Button";
import { useFormSubmit } from "@/hooks/useForm";
import { z } from "zod";

interface Props {
  token: string;
  setStep: (step: "email" | "otp" | "reset") => void;
}

type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
  verificationToken: string;
};

// Zod schema includes verificationToken as required
export const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
    verificationToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword({ token, setStep }: Props) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
      verificationToken: token,
    },
  });

  const { loading, onSubmit } = useFormSubmit<ResetPasswordFormType>({
    apiUrl: "/api/auth/forgot-password/reset-password",
    schema: resetPasswordSchema,
    requireCaptcha: false,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "Password reset successful", color: "success" },
      error: { title: "Error resetting password", color: "danger" },
    },
    onSuccess: () => {
      sessionStorage.removeItem("forgotPasswordEmail");
      sessionStorage.removeItem("forgotPasswordStep");
      sessionStorage.removeItem("otp");
      router.replace("/auth/login");
    },
  });

  const handleFormSubmit = (data: ResetPasswordFormType) => {
    if (!token) return addToast({ title: "Missing token", color: "danger" });
    onSubmit({ ...data, verificationToken: token });
  };

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className="flex flex-col gap-4"
    >
      <h2 className="text-2xl font-semibold text-center">Reset Password</h2>

      <input
        type="password"
        {...register("password")}
        placeholder="New Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.password && (
        <p className="text-sm text-red-500">{errors.password.message}</p>
      )}

      <input
        type="password"
        {...register("confirmPassword")}
        placeholder="Retype New Password"
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {errors.confirmPassword && (
        <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
      )}

      <LoadingButton type="submit" loading={loading}>
        Reset Password
      </LoadingButton>
    </form>
  );
}
