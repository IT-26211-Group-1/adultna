"use client";

import dynamic from "next/dynamic";
import { useRegister } from "../hooks/useRegister";

const LazyRecaptcha = dynamic(() => import("@/components/ui/LazyRecaptcha"), {
  loading: () => (
    <div className="flex justify-center items-center h-[78px] w-[304px] bg-gray-100 rounded border">
      <div className="animate-pulse w-full h-full bg-gray-200 rounded"></div>
    </div>
  ),
  ssr: false,
});

// Component imports
import { UserAuthTitle } from "../_components/UserAuthTitle";
import { FormInput } from "../_components/FormInput";
import { CheckboxField } from "../_components/CheckboxField";
import { AuthButton } from "../_components/AuthButton";
import { GoogleSignInButton } from "../_components/GoogleSignInButton";
import { ImageContainer } from "../_components/ImageContainer";
import { AuthFooter } from "../_components/AuthFooter";

export const RegisterForm = () => {
  const {
    register,
    errors,
    loading,
    onSubmit,
    watch,
    showCaptcha,
    setShowCaptcha,
    recaptchaRef,
    handleCaptchaChange,
    handleCaptchaExpired,
  } = useRegister();

  const watchedValues = watch();

  const areFieldsFilled =
    watchedValues.firstName &&
    watchedValues.lastName &&
    watchedValues.email &&
    watchedValues.password &&
    watchedValues.confirmPassword &&
    watchedValues.acceptedTerms;

  const handleClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showCaptcha && areFieldsFilled) {
      setShowCaptcha(true);
      return;
    }
    onSubmit();
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

          <form className="space-y-6" onSubmit={handleClick}>
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
                <LazyRecaptcha
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
