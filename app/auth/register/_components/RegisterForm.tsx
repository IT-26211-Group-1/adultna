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
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      acceptedTerms,
    } = watchedValues;

    return (
      firstName &&
      lastName &&
      email &&
      password &&
      confirmPassword &&
      acceptedTerms
    );
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
            subtitle="Hi there! Please enter your details."
            title="Get Started!"
          />

          <form className="space-y-6" onSubmit={handleRegisterClick}>
            {/* Name Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                error={errors.firstName?.message}
                name="firstName"
                placeholder="First Name"
                register={register}
              />
              <FormInput
                error={errors.lastName?.message}
                name="lastName"
                placeholder="Last Name"
                register={register}
              />
            </div>

            {/* Email Field */}
            <FormInput
              error={errors.email?.message}
              name="email"
              placeholder="Email"
              register={register}
              type="email"
            />

            {/* Password Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormInput
                error={errors.password?.message}
                name="password"
                placeholder="Password"
                register={register}
                type="password"
              />
              <FormInput
                error={errors.confirmPassword?.message}
                name="confirmPassword"
                placeholder="Confirm Password"
                register={register}
                type="password"
              />
            </div>

            {/* Terms and Conditions */}
            <CheckboxField
              error={errors.acceptedTerms?.message}
              label="I accept the terms and conditions"
              name="acceptedTerms"
              register={register}
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
              <AuthButton className="" loading={loading} type="submit">
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
