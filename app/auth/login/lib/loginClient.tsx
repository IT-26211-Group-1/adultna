"use client";

import Link from "next/link";
import { useLogin } from "../hooks/useLogin";
import { UserAuthTitle } from "../../register/_components/UserAuthTitle";
import { FormInput } from "../../register/_components/FormInput";
import { GoogleSignInButton } from "../../register/_components/GoogleSignInButton";
import { ImageContainer } from "../../register/_components/ImageContainer";
import { LoadingButton } from "@/components/ui/Button";

export const LoginForm = () => {
  const { register, handleSubmit, errors, onSubmit } = useLogin();

  const handleGoogleLogin = async () => {
    try {
      const res = await fetch("/api/auth/google");
      const { url } = await res.json();

      if (url) {
        window.location.href = url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <UserAuthTitle
            subtitle="Hi there! Please sign in to your account."
            title="Welcome Back!"
          />

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <FormInput
              error={errors.email?.message}
              name="email"
              placeholder="Email"
              register={register}
              type="email"
            />

            <FormInput
              error={errors.password?.message}
              name="password"
              placeholder="Password"
              register={register}
              type="password"
            />

            <div className="text-right">
              <Link
                className="text-sm text-green-700 hover:text-green-800 font-medium"
                href="/auth/forgot-password"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="space-y-3">
              <LoadingButton type="submit">Login</LoadingButton>
              <GoogleSignInButton onPress={handleGoogleLogin} />
            </div>

            <div className="text-center mt-10">
              <p className="text-sm text-gray-700">
                Don&apos;t have an account?{" "}
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

      <ImageContainer />
    </div>
  );
};
