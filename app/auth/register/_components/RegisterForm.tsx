"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { registerSchema } from "@/validators/authSchema";
import { addToast } from "@heroui/react";
import ReCAPTCHA from "react-google-recaptcha";
import { useFormSubmit } from "@/hooks/useForm";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Component imports
import { UserAuthTitle } from "../_components/UserAuthTitle";
import { FormInput } from "../_components/FormInput";
import { CheckboxField } from "../_components/CheckboxField";
import { AuthButton } from "../_components/AuthButton";
import { GoogleSignInButton } from "../_components/GoogleSignInButton";
import { ImageContainer } from "../_components/ImageContainer";
import { AuthFooter } from "../_components/AuthFooter";

export const RegisterForm = () => {
  const router = useRouter();
  const [showCaptcha, setShowCaptcha] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
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
      const response = res as {
        data: { verificationToken: string; userId: string };
      };

      localStorage.setItem(
        "verificationToken",
        response.data.verificationToken,
      );
      localStorage.setItem("userId", response.data.userId);
      router.push("/auth/verify-email");
    },
  });

  // Watch form values to check if all required fields are filled
  const watchedValues = watch();

  const areAllFieldsFilled = () => {
    const { firstName, lastName, email, password, confirmPassword, acceptedTerms } = watchedValues;
    return firstName && lastName && email && password && confirmPassword && acceptedTerms;
  };

  const handleRegisterClick = (e: React.FormEvent) => {
    if (!showCaptcha && areAllFieldsFilled()) {
      e.preventDefault();
      setShowCaptcha(true);
      return;
    }

    // If captcha is shown or fields are not filled, proceed with normal form submission
    handleSubmit(onSubmit)(e);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Registration Form */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <UserAuthTitle 
            title="Get Started!" 
            subtitle="Hi there! Please enter your details."
          />

          <form onSubmit={handleRegisterClick} className="space-y-6">
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                register={register}
                name="firstName"
                placeholder="First Name"
                error={errors.firstName?.message}
              />
              <FormInput
                register={register}
                name="lastName"
                placeholder="Last Name"
                error={errors.lastName?.message}
              />
            </div>

            {/* Email Field */}
            <FormInput
              register={register}
              name="email"
              placeholder="Email"
              type="email"
              error={errors.email?.message}
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                register={register}
                name="password"
                placeholder="Password"
                type="password"
                error={errors.password?.message}
              />
              <FormInput
                register={register}
                name="confirmPassword"
                placeholder="Confirm Password"
                type="password"
                error={errors.confirmPassword?.message}
              />
            </div>

            {/* Terms and Conditions */}
            <CheckboxField
              register={register}
              name="acceptedTerms"
              label="I accept the terms and conditions"
              error={errors.acceptedTerms?.message}
            />

            {/* reCAPTCHA */}
            {showCaptcha && (
              <div className="flex justify-center">
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
                  onChange={handleCaptchaChange}
                  onExpired={handleCaptchaExpired}
                />
              </div>
            )}

            {/* Auth Buttons - No spacing between them */}
            <div className="space-y-3">
              <AuthButton loading={loading} type="submit" className="">
                Register
              </AuthButton>
              <GoogleSignInButton />
            </div>

            {/* Footer */}
            <AuthFooter />
          </form>
        </div>
      </div>

      {/* Right Side - Image Container */}
      <ImageContainer />
    </div>
  );
};