"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { secureDocumentAccessOtpSchema } from "@/validators/fileBoxSchema";
import { FileItem } from "./FileItem";

type OtpFormType = { otp: string };

interface SecureDocumentProps {
  file: FileItem;
  onClose?: () => void;
}

export function SecureDocument({ file, onClose }: SecureDocumentProps) {
  const [otpValue, setOtpValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  const {
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<OtpFormType>({
    resolver: zodResolver(secureDocumentAccessOtpSchema),
    mode: "onChange",
    defaultValues: { otp: "" },
  });

  // Split OTP input
  const otpArray = otpValue.padEnd(6, " ").slice(0, 6).split("");

  if (!initialized.current && hiddenInputRef.current) {
    initialized.current = true;
    hiddenInputRef.current.focus();
  }

  const handleOtpChange = (value: string) => {
    // Only allow digits and limit to 6 characters
    const cleanValue = value.replace(/[^0-9]/g, "").slice(0, 6);

    setOtpValue(cleanValue);
    setValue("otp", cleanValue, { shouldValidate: true });
    setFocusedIndex(Math.min(cleanValue.length, 5));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && otpValue.length > 0) {
      e.preventDefault();
      const newValue = otpValue.slice(0, -1);

      setOtpValue(newValue);
      setValue("otp", newValue, { shouldValidate: true });
      setFocusedIndex(Math.max(0, newValue.length));
    }
  };

  const handleBoxClick = (index: number) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setFocusedIndex(index);

      if (index < otpValue.length) {
        const newValue = otpValue.slice(0, index);

        setOtpValue(newValue);
        setValue("otp", newValue, { shouldValidate: true });
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();

    if (/^\d{6}$/.test(pasteData)) {
      handleOtpChange(pasteData);
    }
  };

  const handleResendOtp = () => {
    // Reset OTP and focus
    setOtpValue("");
    setValue("otp", "", { shouldValidate: true });
    setFocusedIndex(0);
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleFormSubmit = (data: OtpFormType) => {
    // Verify OTP and grant access
    console.log("Valid OTP data:", data);
    console.log("Accessing secure file:", file.name);
    // Handle OTP verification logic here
    // TODO: Open/download the secure file
    onClose?.();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl">
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Secure Document Access
            </h1>

            {/* Security Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">
                Security Verification Required
              </h3>
              <p className="text-sm text-gray-700">
                We&apos;ve sent a 6-digit OTP code to your registered email
                address. Enter the code below to{" "}
                <span className="font-medium">access</span> &quot;{file.name}
                &quot;.
              </p>
            </div>
          </div>

          {/* OTP Input Section */}
          <div className="mb-6">
            <label
              className="block text-sm font-medium text-gray-700 mb-4"
              htmlFor="otp-input"
            >
              Enter OTP Code
            </label>

            <div className="relative">
              {/* Hidden input for actual typing */}
              <input
                ref={hiddenInputRef}
                autoComplete="one-time-code"
                className="absolute opacity-0 pointer-events-none"
                id="otp-input"
                inputMode="numeric"
                maxLength={6}
                type="text"
                value={otpValue}
                onChange={(e) => handleOtpChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onPaste={handlePaste}
              />

              {/* Visual OTP boxes */}
              <div className="flex gap-3 justify-center mb-4">
                {otpArray.map((digit, index) => (
                  <div
                    key={index}
                    className={`
                                        w-14 h-14 
                                        border-2 rounded-lg 
                                        flex items-center justify-center 
                                        text-xl font-semibold
                                        cursor-pointer
                                        transition-all duration-200
                                        ${
                                          focusedIndex === index
                                            ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
                                            : digit.trim()
                                              ? "border-gray-400 bg-gray-50"
                                              : "border-gray-300 bg-white hover:border-gray-400"
                                        }
                                    `}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleBoxClick(index)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleBoxClick(index);
                      }
                    }}
                  >
                    {digit.trim() && (
                      <span className="text-gray-800">{digit}</span>
                    )}
                    {focusedIndex === index && !digit.trim() && (
                      <div className="w-0.5 h-6 bg-blue-500 animate-pulse" />
                    )}
                  </div>
                ))}
              </div>

              {/* Error Display */}
              {errors.otp && (
                <p className="text-red-500 text-center mb-4 text-sm">
                  {errors.otp.message}
                </p>
              )}

              {/* Resend OTP */}
              <div className="text-center mb-8">
                <span className="text-sm text-gray-600">
                  Didn&apos;t receive the code?{" "}
                </span>
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium underline"
                  type="button"
                  onClick={handleResendOtp}
                >
                  Resend OTP
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button
              className="flex-1 py-3 border-gray-300 text-gray-700 hover:bg-gray-50"
              type="button"
              variant="bordered"
              onPress={handleCancel}
            >
              Cancel
            </Button>
            <Button
              className="flex-1 py-3 bg-adult-green hover:bg-adult-green/90 text-white font-medium"
              isDisabled={isSubmitting || otpValue.length !== 6}
              type="submit"
              variant="solid"
            >
              {isSubmitting ? "Verifying..." : "Verify & Access"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
