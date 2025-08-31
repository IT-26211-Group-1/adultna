"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useFormSubmit } from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import { LoadingButton } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";

export const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const { loading, onSubmit } = useFormSubmit<z.infer<typeof loginSchema>>({
    apiUrl: "/api/auth/login",
    schema: loginSchema,
    requireCaptcha: false,
    toastLib: { addToast },
    toastMessages: {
      success: { title: "Login Successful!", color: "success" },
      error: { title: "Login Failed", color: "danger" },
    },

    onSuccess: (res) => {
      if (res.data?.needsVerification) {
        localStorage.setItem("verificationToken", res.data.verificationToken);
        addToast({
          title: "Email not verified",
          description: "Check your inbox for the OTP",
          color: "warning",
        });
        router.push("/verify-email");
        return;
      }
      router.push("/dashboard");
    },
  });

  const handleGoogleLogin = () => {
    // window.location.href = `/auth/google/callback`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form
        className="space-y-4 w-full max-w-md bg-white p-6 rounded-2xl shadow-md"
        onSubmit={handleSubmit(onSubmit)}
      >
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

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

        {/* Forgot Password */}
        <div className="text-right">
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Submit */}
        <LoadingButton loading={loading} type="submit">
          Login
        </LoadingButton>

        {/* OR divider */}
        <div className="flex items-center gap-2 my-4">
          <div className="flex-1 h-px bg-gray-300" />
          <span className="text-sm text-gray-500">or continue with</span>
          <div className="flex-1 h-px bg-gray-300" />
        </div>

        {/* Login using Google */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            width={20}
            height={20}
            priority={false}
          />
          <span>Continue with Google</span>
        </button>
      </form>
    </div>
  );
};
