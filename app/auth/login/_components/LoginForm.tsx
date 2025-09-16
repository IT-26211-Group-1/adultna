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
    try {
      const res = await fetch("/api/auth/google");
      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      } else {
        addToast({
          title: "Error",
          description: "Unable to initiate Google login",
          color: "danger",
        });
      }
    } catch (error) {
      console.error("Google login error:", error);
      addToast({
        title: "Error",
        description: "Failed to connect to Google login",
        color: "danger",
      });
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <UserAuthTitle
            subtitle="Hi there! Please sign in to your account."
            title="Welcome Back!"
          />

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Field */}
            <FormInput
              error={errors.email?.message}
              name="email"
              placeholder="Email"
              register={register}
              type="email"
            />

            {/* Password Field */}
            <FormInput
              error={errors.password?.message}
              name="password"
              placeholder="Password"
              register={register}
              type="password"
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
              <GoogleSignInButton onPress={handleGoogleLogin} />
            </div>

            {/* Footer */}
            <div className="text-center mt-10">
              <p className="text-sm text-gray-700">
                Don&apos;t have an account? {"     "}
                <Link
                  className="text-green-700 hover:text-green-800 font-medium"
                  href="/auth/register"
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
