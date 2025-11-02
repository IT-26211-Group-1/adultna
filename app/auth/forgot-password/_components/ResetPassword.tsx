"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { AuthButton } from "../../register/_components/AuthButton";
import { FormInput } from "../../register/_components/FormInput";
import { useForgotPasswordFlow } from "@/hooks/queries/useForgotPasswordQueries";
import { z } from "zod";

type ResetPasswordFormType = {
  password: string;
  confirmPassword: string;
};

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/\d/, "Password must contain at least one number")
      .regex(
        /[!@#$%^&*(),.?":{}|<>]/,
        "Password must contain at least one special character",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function ResetPassword() {
  const router = useRouter();
  const {
    resetPassword,
    isResettingPassword,
    getStoredToken,
    clearForgotPasswordData,
  } = useForgotPasswordFlow();

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
    },
  });

  const handleFormSubmit = (data: ResetPasswordFormType) => {
    const token = getStoredToken();

    if (!token) {
      addToast({ title: "Missing verification token", color: "danger" });

      return;
    }

    resetPassword(
      { verificationToken: token, password: data.password },
      {
        onSuccess: () => {
          addToast({
            title: "Password reset successful",
            color: "success",
          });
          clearForgotPasswordData();
          router.replace("/auth/login");
        },
        onError: (error) => {
          addToast({
            title: "Error resetting password",
            description: error?.message || "Please try again",
            color: "danger",
          });
        },
      },
    );
  };

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <div className="space-y-4">
        <FormInput
          error={errors.password?.message}
          name="password"
          placeholder="New Password"
          register={register}
          type="password"
        />

        <FormInput
          error={errors.confirmPassword?.message}
          name="confirmPassword"
          placeholder="Confirm New Password"
          register={register}
          type="password"
        />
      </div>

      <AuthButton loading={isResettingPassword} type="submit">
        Reset Password
      </AuthButton>
    </form>
  );
}
