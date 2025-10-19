"use client";

import { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { secureDocumentAccessOtpSchema } from "@/validators/fileBoxSchema";
import { FileItem } from "./FileItem";
import {
  useRequestDocumentOTP,
  useVerifyDocumentOTP,
} from "@/hooks/queries/useFileboxQueries";
import { OTPAction } from "@/types/filebox";
import { ResendTimer } from "@/components/ui/ResendTimer";

type OtpFormType = { otp: string };

interface SecureDocumentProps {
  file: FileItem;
  action?: OTPAction;
  onClose?: () => void;
  onSuccess?: (downloadUrl: string) => void;
}

const COOLDOWN_SECONDS = 120; // 2 minutes cooldown

export function SecureDocument({
  file,
  action = "preview",
  onClose,
  onSuccess,
}: SecureDocumentProps) {
  const [otpValue, setOtpValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Debug: Log the action prop
  console.log(`[SecureDocument] Rendered with action: ${action}`);

  // Mutations
  const requestOTPMutation = useRequestDocumentOTP();
  const verifyOTPMutation = useVerifyDocumentOTP();

  const {
    handleSubmit,
    setValue,
    clearErrors,
    formState: { errors },
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

  // Request OTP for the first time or resend
  const handleRequestOtp = async (): Promise<number> => {
    setErrorMessage("");
    setSuccessMessage("");

    return new Promise((resolve, reject) => {
      requestOTPMutation.mutate(
        { fileId: file.id, action },
        {
          onSuccess: (data) => {
            setSuccessMessage(data.message);
            setErrorMessage("");
            setOtpSent(true);
            setCooldown(COOLDOWN_SECONDS);
            resolve(COOLDOWN_SECONDS);
          },
          onError: (error: any) => {
            setErrorMessage(
              error.message || "Failed to send OTP. Please try again."
            );
            setSuccessMessage("");
            reject(error);
          },
        }
      );
    });
  };

  const handleResendOtp = async (): Promise<number> => {
    // Reset OTP and focus
    setOtpValue("");
    setValue("otp", "", { shouldValidate: false });
    clearErrors("otp");
    setFocusedIndex(0);

    // Request new OTP
    const cooldown = await handleRequestOtp();

    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
    }

    return cooldown;
  };

  const handleCancel = () => {
    onClose?.();
  };

  const handleFormSubmit = async (data: OtpFormType) => {
    setErrorMessage("");
    setSuccessMessage("");

    console.log(`[SecureDocument] Verifying OTP for action: ${action}`);

    verifyOTPMutation.mutate(
      { fileId: file.id, otp: data.otp, action },
      {
        onSuccess: async (response) => {
          console.log(
            `[SecureDocument] OTP verified successfully for action: ${action}`,
            response
          );

          if (action === "delete") {
            // For delete, just trigger success callback (no download needed)
            setSuccessMessage("Access granted! Proceeding to delete...");
            setTimeout(() => {
              onSuccess?.(""); // Pass empty string for delete action
              onClose?.();
            }, 500);

            return;
          }

          if (response.downloadUrl) {
            try {
              if (action === "preview") {
                // Pass the download URL to parent to open FilePreview
                setSuccessMessage("Access granted! Opening preview...");
                setTimeout(() => {
                  if (response.downloadUrl) {
                    onSuccess?.(response.downloadUrl);
                  }
                  onClose?.();
                }, 500);
              } else if (action === "download") {
                // Fetch the file and trigger download
                const fileResponse = await fetch(response.downloadUrl);

                if (!fileResponse.ok) {
                  throw new Error("Failed to download file");
                }

                const blob = await fileResponse.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                // Trigger download
                const link = document.createElement("a");

                link.href = blobUrl;
                link.download = file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

                // Clean up
                window.URL.revokeObjectURL(blobUrl);

                setSuccessMessage("File downloaded successfully!");
                setTimeout(() => {
                  onClose?.();
                }, 1500);
              }
            } catch {
              setErrorMessage(`Failed to ${action} file. Please try again.`);
            }
          }
        },
        onError: (error: any) => {
          console.error(
            `[SecureDocument] OTP verification failed for action: ${action}`,
            error
          );
          setErrorMessage(
            error.message || "Invalid or expired OTP. Please try again."
          );
        },
      }
    );
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
                {otpSent
                  ? `We've sent a 6-digit OTP code to your registered email address. The code will expire in 5 minutes. Enter the code below to ${action} "${file.name}". (Action: ${action})`
                  : `To ${action} "${file.name}", you'll need to verify your identity. Click the button below to receive a 6-digit OTP code via email. (Action: ${action})`}
              </p>
            </div>

            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-green-700">{successMessage}</p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-red-700">{errorMessage}</p>
              </div>
            )}
          </div>

          {/* Send OTP Button */}
          {!otpSent && (
            <div className="mb-6">
              <Button
                className="w-full py-3 bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                isDisabled={requestOTPMutation.isPending}
                type="button"
                variant="solid"
                onPress={async () => {
                  await handleRequestOtp();
                }}
              >
                {requestOTPMutation.isPending
                  ? "Sending OTP..."
                  : "Send OTP to Email"}
              </Button>
            </div>
          )}

          {/* OTP Input Section */}
          {otpSent && (
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
                <div className="mb-8">
                  <ResendTimer
                    cooldown={cooldown}
                    handleResendOtp={handleResendOtp}
                    resending={requestOTPMutation.isPending}
                    verificationToken={file.id}
                  />
                </div>
              </div>
            </div>
          )}

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
            {otpSent && (
              <Button
                className="flex-1 py-3 bg-adult-green hover:bg-adult-green/90 text-white font-medium"
                isDisabled={
                  verifyOTPMutation.isPending || otpValue.length !== 6
                }
                type="submit"
                variant="solid"
              >
                {verifyOTPMutation.isPending
                  ? "Verifying..."
                  : action === "download"
                    ? "Verify & Download"
                    : action === "delete"
                      ? "Verify & Delete"
                      : `Verify & (${action})`}
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
