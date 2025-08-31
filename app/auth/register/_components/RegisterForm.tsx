"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormSubmit } from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LoadingButton } from "@/components/ui/Button";

export const RegisterForm = () => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof registerSchema> & { emailVerified?: boolean }>({
    resolver: zodResolver(registerSchema),
    mode: "onBlur",
  });

  const {
    loading,
    recaptchaRef,
    handleCaptchaChange,
    handleCaptchaExpired,
    onSubmit,
  } = useFormSubmit<z.infer<typeof registerSchema>>({
    apiUrl: "/api/auth/register",
    schema: registerSchema,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "Registration Successful!", color: "success" },
      error: { title: "Registration Failed", color: "danger" },
      captcha: { title: "Please verify captcha", color: "warning" },
    },
    onSuccess: (res) => {
      localStorage.setItem("verificationToken", res.data.verificationToken);
      router.push("/auth/verify-email");
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Register</h2>

        {/* First and Last Name */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <input
              {...register("firstName")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="First Name"
            />
            <p className="text-sm text-red-500 mt-1">
              {errors.firstName?.message}
            </p>
          </div>

          <div className="flex-1">
            <input
              {...register("lastName")}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Last Name"
            />
            <p className="text-sm text-red-500 mt-1">
              {errors.lastName?.message}
            </p>
          </div>
        </div>

        {/* Email */}
        <div>
          <input
            {...register("email")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Email"
            type="email"
          />
          <p className="text-sm text-red-500 mt-1">{errors.email?.message}</p>
        </div>

        {/* Password */}
        <div>
          <input
            {...register("password")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            type="password"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.password?.message}
          </p>
        </div>

        {/* Confirm Password */}
        <div>
          <input
            {...register("confirmPassword")}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Confirm Password"
            type="password"
          />
          <p className="text-sm text-red-500 mt-1">
            {errors.confirmPassword?.message}
          </p>
        </div>

        {/* Accepted Terms */}
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            {...register("acceptedTerms")}
            className="w-4 h-4"
            id="acceptedTerms"
          />
          <label className="text-sm" htmlFor="acceptedTerms">
            I accept the terms and conditions
          </label>
        </div>
        <p className="text-sm text-red-500 mt-1">
          {errors.acceptedTerms?.message}
        </p>

        {/* reCAPTCHA */}
        <div>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
            onChange={handleCaptchaChange}
            onExpired={handleCaptchaExpired}
          />
        </div>

        {/* Submit Button */}
        <LoadingButton type="submit" loading={loading}>
          Register
        </LoadingButton>
      </form>
    </div>
  );
};
