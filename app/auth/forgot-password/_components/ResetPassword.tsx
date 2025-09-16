"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/react";
import { AuthButton } from "../../register/_components/AuthButton";
import { FormInput } from "../../register/_components/FormInput";
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

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one special character"),
    confirmPassword: z.string(),
    verificationToken: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword({ token }: Props) {
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(resetPasswordSchema),
    mode: "onBlur",
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
      sessionStorage.removeItem("forgotPasswordToken");
      router.replace("/auth/login");
    },
  });

  const handleFormSubmit = (data: ResetPasswordFormType) => {
    if (!token) return addToast({ title: "Missing token", color: "danger" });
    sessionStorage.removeItem("forgotPasswordEmail");
    sessionStorage.removeItem("forgotPasswordStep");
    sessionStorage.removeItem("forgotPasswordToken");
    onSubmit({ ...data, verificationToken: token });
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          register={register}
          name="password"
          type="password"
          placeholder="New Password"
          error={errors.password?.message}
        />

        <FormInput
          register={register}
          name="confirmPassword"
          type="password"
          placeholder="Confirm New Password"
          error={errors.confirmPassword?.message}
        />
      </div>

      <AuthButton loading={loading} type="submit">
        Reset Password
      </AuthButton>
    </form>
  );
}
