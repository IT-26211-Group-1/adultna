"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { addToast } from "@heroui/toast";
import { LoadingButton } from "@/components/ui/Button";
import { useAdminForgotPasswordFlow } from "@/hooks/queries/admin/useAdminForgotPassword";
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
  } = useAdminForgotPasswordFlow();

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
          router.replace("/admin/login");
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
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <input
          {...register("password")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
          placeholder="New Password"
          type="password"
        />
        {errors.password && (
          <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
        )}
      </div>

      <div>
        <input
          {...register("confirmPassword")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
          placeholder="Confirm New Password"
          type="password"
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <LoadingButton loading={isResettingPassword} type="submit">
        Reset Password
      </LoadingButton>
    </form>
  );
}
