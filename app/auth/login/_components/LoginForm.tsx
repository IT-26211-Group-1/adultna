"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { loginSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import { useFormSubmit } from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import { LoginResponse } from "@/types/auth";
import Link from "next/link";

// Component imports
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { FormInput } from "../../register/_components/FormInput";
import { AuthButton } from "../../register/_components/AuthButton";
import { GoogleSignInButton } from "../../register/_components/GoogleSignInButton";
import { ImageContainer } from "../../register/_components/ImageContainer";

export const LoginForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  const { loading, onSubmit } = useFormSubmit<
    z.infer<typeof loginSchema>,
    LoginResponse
  >({
    apiUrl: "/api/auth/login",
    schema: loginSchema,
    requireCaptcha: false,
    showToast: false,

    onSuccess: async () => {
      addToast({
        title: "Login Successful!",
        color: "success",
      });
      router.replace("/dashboard");
    },

    onError: async (error: string | LoginResponse) => {
      if (typeof error !== "string" && error.needsVerification) {
        addToast({
          title: "Email not verified",
          description: "Check your inbox for the OTP",
          color: "warning",
        });
        router.replace("/auth/verify-email");

        return;
      }

      const message =
        typeof error === "string"
          ? error
          : error.message || "Invalid email or password";

      setError("email", { type: "manual", message });

      addToast({
        title: "Login Failed",
        description:
          typeof error === "string"
            ? error
            : error.message || "Something went wrong",
        color: "danger",
      });
    },
  });

  const handleGoogleLogin = async () => {
    const res = await fetch("/api/auth/google");
    const { url } = await res.json();

    window.location.href = url;
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <UserAuthTitle
            title="Welcome Back!"
            subtitle="Hi there! Please sign in to your account."
          />

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <FormInput
              register={register}
              name="email"
              placeholder="Email"
              type="email"
              error={errors.email?.message}
            />

            {/* Password Field */}
            <FormInput
              register={register}
              name="password"
              placeholder="Password"
              type="password"
              error={errors.password?.message}
            />

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                className="text-sm text-green-700 hover:text-green-800 font-medium"
                href="/auth/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            {/* Auth Buttons - No spacing between them */}
            <div className="space-y-3">
              <AuthButton loading={loading} type="submit">
                Login
              </AuthButton>
              <GoogleSignInButton />
            </div>

            {/* Footer */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-700">
                Don't have an account? {'     '}
                <Link
                  href="/auth/register"
                  className="text-green-700 hover:text-green-800 font-medium"
                >
                  Register here!
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer />
    </div>
  );
};
