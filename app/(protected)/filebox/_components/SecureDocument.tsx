"use client";

import { useState, useRef, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
} from "@heroui/react";
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
import { useSecureStorage } from "@/hooks/useSecureStorage";
import { logger } from "@/lib/logger";

type OtpFormType = { otp: string };

interface SecureDocumentProps {
  file: FileItem;
  fileId?: string; // Optional: use this for OTP operations if provided
  action?: OTPAction;
  isOpen?: boolean;
  onClose?: () => void;
  onSuccess?: (downloadUrl: string) => void;
}

const COOLDOWN_SECONDS = 120; // 2 minutes cooldown

export function SecureDocument({
  file,
  fileId,
  action = "preview",
  isOpen = true,
  onClose,
  onSuccess,
}: SecureDocumentProps) {
  const { setSecureItem, removeSecureItem } = useSecureStorage();

  // Use provided fileId or fall back to file.id
  const actualFileId = fileId || file.id;

  // Memoize the storage key for this file+action combination
  const cooldownKey = useMemo(
    () => `otp_cooldown_${actualFileId}_${action}`,
    [actualFileId, action],
  );

  const [otpValue, setOtpValue] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [lockedUntil, setLockedUntil] = useState<Date | null>(null);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(
    null,
  );

  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

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

  // Countdown timer for lockout
  useEffect(() => {
    if (!lockedUntil) {
      setLockoutSeconds(0);

      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const remaining = Math.max(
        0,
        Math.ceil((lockedUntil.getTime() - now) / 1000),
      );

      setLockoutSeconds(remaining);

      if (remaining === 0) {
        setLockedUntil(null);
        setErrorMessage("");
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [lockedUntil]);

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
        { fileId: actualFileId, action },
        {
          onSuccess: (data) => {
            setSuccessMessage(data.message);
            setErrorMessage("");
            setOtpSent(true);
            setCooldown(COOLDOWN_SECONDS);

            // Store cooldown expiry timestamp in secure storage
            const expiryTime = Date.now() + COOLDOWN_SECONDS * 1000;

            setSecureItem(
              cooldownKey,
              expiryTime.toString(),
              COOLDOWN_SECONDS / 60,
            );

            resolve(COOLDOWN_SECONDS);
          },
          onError: (error: any) => {
            setErrorMessage(
              error.message || "Failed to send OTP. Please try again.",
            );
            setSuccessMessage("");
            reject(error);
          },
        },
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

    // If valid, proceed to next step (OTP will be consumed)
    if (action === "rename" || action === "unprotect") {
      verifyOTPMutation.mutate(
        { fileId: actualFileId, otp: data.otp, action },
        {
          onSuccess: async () => {
            // Clear cooldown on successful verification
            removeSecureItem(cooldownKey);
            sessionStorage.removeItem(`otpTimer:${actualFileId}`);

            if (action === "rename") {
              setSuccessMessage("Access granted! You can now rename the file.");
            } else if (action === "unprotect") {
              setSuccessMessage(
                "Access granted! Proceeding to confirmation...",
              );
            }

            // OTP is verified and consumed - proceed to next step
            onSuccess?.("verified"); // Pass flag indicating OTP was verified
            onClose?.();
          },
          onError: (error: any) => {
            logger.error(
              `[SecureDocument] OTP verification failed for action: ${action}`,
              error,
            );

            // Parse error response - could be in error.data or error.response
            const errorData =
              error.data || error.response?.data || error.response || {};

            // Check if error contains lockout information
            if (errorData.lockedUntil) {
              const lockoutDate = new Date(errorData.lockedUntil);

              setLockedUntil(lockoutDate);
              setErrorMessage(
                `Too many failed attempts. Please wait before trying again.`,
              );
            } else if (errorData.remainingAttempts !== undefined) {
              setRemainingAttempts(errorData.remainingAttempts);
              setErrorMessage(error.message || "Invalid OTP code.");
            } else {
              setErrorMessage(
                error.message || "Invalid or expired OTP. Please try again.",
              );
            }
          },
        },
      );

      return;
    }

    // For other actions (preview, download, delete), verify OTP here
    verifyOTPMutation.mutate(
      { fileId: actualFileId, otp: data.otp, action },
      {
        onSuccess: async (response) => {
          // Clear cooldown on successful verification
          removeSecureItem(cooldownKey);

          // Also clear ResendTimer's sessionStorage
          sessionStorage.removeItem(`otpTimer:${actualFileId}`);

          if (action === "delete") {
            setSuccessMessage("Access granted! Proceeding to delete...");
            onSuccess?.("");
            onClose?.();

            return;
          }

          if (response.downloadUrl) {
            try {
              if (action === "preview") {
                setSuccessMessage("Access granted! Opening preview...");
                if (response.downloadUrl) {
                  onSuccess?.(response.downloadUrl);
                }
                onClose?.();
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
                onClose?.();
              }
            } catch {
              setErrorMessage(`Failed to ${action} file. Please try again.`);
            }
          }
        },
        onError: (error: any) => {
          logger.error(
            `[SecureDocument] OTP verification failed for action: ${action}`,
            error,
          );

          // Parse error response - could be in error.data or error.response
          const errorData =
            error.data || error.response?.data || error.response || {};

          // Check if error contains lockout information
          if (errorData.lockedUntil) {
            const lockoutDate = new Date(errorData.lockedUntil);

            setLockedUntil(lockoutDate);
            setErrorMessage(
              `Too many failed attempts. Please wait before trying again.`,
            );
          } else if (errorData.remainingAttempts !== undefined) {
            setRemainingAttempts(errorData.remainingAttempts);
            setErrorMessage(error.message || "Invalid OTP code.");
          } else {
            setErrorMessage(
              error.message || "Invalid or expired OTP. Please try again.",
            );
          }
        },
      },
    );
  };

  return (
    <Modal
      backdrop="blur"
      classNames={{
        backdrop: "backdrop-blur-md bg-black/30 z-[9999] fixed inset-0",
        wrapper: "z-[10000]",
        base: "z-[10001]",
      }}
      isOpen={isOpen}
      placement="center"
      size="md"
      onClose={onClose}
    >
      <ModalContent>
        <form onSubmit={handleSubmit(handleFormSubmit)}>
          <ModalHeader className="flex flex-col items-center px-6 pt-8 pb-0 text-center">
            {/* Icon at the top */}
            <div className="mb-6">
              <Image
                alt="Security lock icon"
                className="w-28 h-28"
                height={112}
                src="/filebox-lock.png"
                width={112}
              />
            </div>
          </ModalHeader>

          <ModalBody className="px-6 py-0 pb-6">
            <div className="text-center space-y-6">
              {/* Dynamic Content */}
              {!otpSent ? (
                <>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Secure Document Access
                    </h3>
                    <div className="text-sm text-gray-700">
                      <p className="mb-2">
                        You are requesting to <strong>{action}</strong> the
                        secure document:
                      </p>
                      <p className="font-semibold text-[#11553F]">
                        {file.name}
                      </p>
                    </div>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {lockoutSeconds > 0 ? (
                        <div>
                          <p>Too many failed attempts.</p>
                          <p className="mt-2">
                            Please wait{" "}
                            <span className="font-semibold text-base">
                              {lockoutSeconds}
                            </span>{" "}
                            {lockoutSeconds === 1 ? "second" : "seconds"} before
                            trying again.
                          </p>
                        </div>
                      ) : (
                        <div>
                          {errorMessage}
                          {remainingAttempts !== null &&
                            remainingAttempts > 0 && (
                              <div className="mt-1 text-xs">
                                {remainingAttempts}{" "}
                                {remainingAttempts === 1
                                  ? "attempt"
                                  : "attempts"}{" "}
                                remaining
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}

                  {/* Send Code Button */}
                  <Button
                    className="w-full py-3 bg-[#11553F] hover:bg-[#0d4532] text-white font-medium rounded-lg"
                    isDisabled={requestOTPMutation.isPending}
                    type="button"
                    variant="solid"
                    onPress={async () => {
                      await handleRequestOtp();
                    }}
                  >
                    {requestOTPMutation.isPending
                      ? `Sending OTP to ${action.charAt(0).toUpperCase() + action.slice(1)}...`
                      : `Send OTP to ${action.charAt(0).toUpperCase() + action.slice(1)}`}
                  </Button>

                  <p className="text-gray-500 text-xs leading-relaxed">
                    A 6-digit code will be sent to your registered email
                    address.
                  </p>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <h3 className="text-xl font-semibold text-gray-900">
                      Verify Your Identity
                    </h3>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      We&apos;ve sent a 6-digit verification code to your
                      registered email address. Please enter the code below to
                      securely access your document.
                    </p>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm">
                      {lockoutSeconds > 0 ? (
                        <div>
                          <p>Too many failed attempts.</p>
                          <p className="mt-2">
                            Please wait{" "}
                            <span className="font-semibold text-base">
                              {lockoutSeconds}
                            </span>{" "}
                            {lockoutSeconds === 1 ? "second" : "seconds"} before
                            trying again.
                          </p>
                        </div>
                      ) : (
                        <div>
                          {errorMessage}
                          {remainingAttempts !== null &&
                            remainingAttempts > 0 && (
                              <div className="mt-1 text-xs">
                                {remainingAttempts}{" "}
                                {remainingAttempts === 1
                                  ? "attempt"
                                  : "attempts"}{" "}
                                remaining
                              </div>
                            )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Success Message */}
                  {successMessage && (
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-sm">
                      {successMessage}
                    </div>
                  )}

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

                  {/* Visual OTP input */}
                  <div className="flex gap-2 justify-center mb-6">
                    {otpArray.map((digit, index) => (
                      <div
                        key={index}
                        className={`
                          w-12 h-12
                          border-2 rounded-lg
                          flex items-center justify-center
                          text-lg font-semibold
                          cursor-pointer
                          transition-all duration-200
                          ${
                            focusedIndex === index
                              ? "border-[#11553F] bg-green-50"
                              : digit.trim()
                                ? "border-[#11553F] bg-green-50"
                                : "border-gray-300 bg-gray-50 hover:border-gray-400"
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
                          <span className="text-gray-900">{digit}</span>
                        )}
                        {focusedIndex === index && !digit.trim() && (
                          <div className="w-0.5 h-5 bg-[#11553F] animate-pulse" />
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Error Display */}
                  {errors.otp && (
                    <p className="text-red-500 text-sm mb-4">
                      {errors.otp.message}
                    </p>
                  )}

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      className="w-full py-3 bg-[#11553F] hover:bg-[#0d4532] text-white font-medium rounded-lg"
                      isDisabled={
                        verifyOTPMutation.isPending ||
                        otpValue.length !== 6 ||
                        lockoutSeconds > 0
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
                            : `Verify & ${action.charAt(0).toUpperCase() + action.slice(1)}`}
                    </Button>

                    <div className="flex items-center justify-center space-x-4 text-sm">
                      <ResendTimer
                        cooldown={cooldown}
                        handleResendOtp={handleResendOtp}
                        resending={requestOTPMutation.isPending}
                        verificationToken={actualFileId}
                      />
                      <span className="text-gray-300">|</span>
                      <button
                        className="text-gray-500 hover:text-gray-700"
                        type="button"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </ModalBody>
        </form>
      </ModalContent>
    </Modal>
  );
}
