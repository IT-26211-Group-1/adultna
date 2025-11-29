"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { FormInput } from "../../register/_components/FormInput";
import { AuthButton } from "../../register/_components/AuthButton";
import { GoogleSignInButton } from "../../register/_components/GoogleSignInButton";
import { ImageContainer } from "../../register/_components/ImageContainer";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../../../../hooks/useGoogleAuth";
import { useSecureStorage } from "@/hooks/useSecureStorage";

export const LoginForm = () => {
  const { register, errors, loading, onSubmit } = useLogin();
  const { handleGoogleSignIn } = useGoogleAuth();
  const { removeSecureItem } = useSecureStorage();

  const handleForgotPasswordClick = () => {
    // Clear forgot password flow data to start fresh
    removeSecureItem("forgotPasswordEmail");
    removeSecureItem("forgotPasswordStep");
    removeSecureItem("forgotPasswordToken");
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          {/* Back Button */}
          <div className="mb-6">
            <Link
              className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-green-700 transition-colors duration-200 group"
              href="/"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" />
              Back to Home
            </Link>
          </div>

          <UserAuthTitle
            subtitle="Hi there! Please sign in to your account."
            title="Welcome Back!"
          />

          <form className="space-y-6" onSubmit={onSubmit}>
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
                onClick={handleForgotPasswordClick}
              >
                Forgot Password?
              </Link>
            </div>

            {/* Auth Buttons - No spacing between them */}
            <div className="space-y-3">
              <AuthButton loading={loading} type="submit">
                Login
              </AuthButton>
              <GoogleSignInButton onPress={() => handleGoogleSignIn("login")} />
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
