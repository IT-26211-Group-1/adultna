"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoadingButton } from "@/components/ui/Button";
import { useAdminForgotPasswordFlow } from "@/hooks/queries/admin/useAdminForgotPassword";
import { forgotPasswordSchema } from "@/validators/authSchema";

type EmailFormType = { email: string };

export default function InputEmail() {
  const { sendOtp, isSendingOtp } = useAdminForgotPasswordFlow();
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

  const handleFormSubmit = (data: EmailFormType) => {
    sendOtp(data);
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(handleFormSubmit)}>
      <div>
        <input
          {...register("email")}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-adult-green"
          placeholder="Email Address"
          type="email"
        />
        {errors.email && (
          <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
        )}
      </div>

      <LoadingButton loading={isSendingOtp} type="submit">
        Send OTP
      </LoadingButton>
    </form>
  );
}
