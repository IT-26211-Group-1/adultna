"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AuthButton } from "../../register/_components/AuthButton";
import { FormInput } from "../../register/_components/FormInput";
import { useForgotPasswordFlow } from "@/hooks/queries/useForgotPasswordQueries";
import { forgotPasswordSchema } from "@/validators/authSchema";

type EmailFormType = { email: string };

export default function InputEmail() {
  const { sendOtp, isSendingOtp } = useForgotPasswordFlow();
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
    <form
      className="flex flex-col gap-4"
      onSubmit={handleSubmit(handleFormSubmit)}
    >
      <FormInput
        error={errors.email?.message}
        name="email"
        placeholder="Enter your email address"
        register={register}
        type="email"
      />
      <AuthButton loading={isSendingOtp} type="submit">
        Send OTP
      </AuthButton>
    </form>
  );
}
