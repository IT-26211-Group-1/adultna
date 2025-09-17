"use client";

import dynamic from "next/dynamic";

const AuthFormSkeleton = () => (
  <div className="min-h-screen flex">
    <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
      <div className="w-full max-w-md space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-2"></div>
          <div className="h-4 bg-gray-200 rounded mb-6"></div>
          <div className="space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    </div>
    <div className="hidden lg:block lg:w-1/2 bg-gray-100"></div>
  </div>
);

export const LazyLoginForm = dynamic(
  () =>
    import("@/app/auth/login/_components/LoginForm").then((mod) => ({
      default: mod.LoginForm,
    })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);

export const LazyRegisterForm = dynamic(
  () =>
    import("@/app/auth/register/_components/RegisterForm").then((mod) => ({
      default: mod.RegisterForm,
    })),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);

export const LazyForgotPasswordForm = dynamic(
  () => import("@/app/auth/forgot-password/_components/ForgotPasswordForm"),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);

export const LazyVerifyEmail = dynamic(
  () => import("@/app/auth/verify-email/_components/VerifyEmail"),
  {
    loading: () => <AuthFormSkeleton />,
    ssr: false,
  }
);
