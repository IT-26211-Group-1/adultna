"use client";

import Link from "next/link";
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { FormInput } from "../../register/_components/FormInput";
import { AuthButton } from "../../register/_components/AuthButton";
import { GoogleSignInButton } from "../../register/_components/GoogleSignInButton";
import { ImageContainer } from "../../register/_components/ImageContainer";
import { useLogin } from "../hooks/useLogin";
import { useGoogleAuth } from "../../../../hooks/useGoogleAuth";

export const LoginForm = () => {
  const { register, errors, loading, onSubmit } = useLogin();
  const { handleGoogleSignIn } = useGoogleAuth();

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
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
