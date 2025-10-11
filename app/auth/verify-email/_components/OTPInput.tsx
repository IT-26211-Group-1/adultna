"use client";

import { useRef, useState, useEffect } from "react";

interface OTPInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
}

export const OTPInput = ({ value, onChange, length = 6 }: OTPInputProps) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const hiddenInputRef = useRef<HTMLInputElement>(null);
  const initialized = useRef(false);

  // Split OTP input
  const otpArray = value.padEnd(length, " ").slice(0, length).split("");

  useEffect(() => {
    if (!initialized.current && hiddenInputRef.current) {
      initialized.current = true;
      hiddenInputRef.current.focus();
    }
  }, []);

  const handleOtpChange = (inputValue: string) => {
    // Only allow digits and limit to specified length
    const cleanValue = inputValue.replace(/[^0-9]/g, "").slice(0, length);

    onChange(cleanValue);
    setFocusedIndex(Math.min(cleanValue.length, length - 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && value.length > 0) {
      const newValue = value.slice(0, -1);

      onChange(newValue);
      setFocusedIndex(Math.max(0, newValue.length));
    }
  };

  const handleBoxClick = (index: number) => {
    if (hiddenInputRef.current) {
      hiddenInputRef.current.focus();
      setFocusedIndex(index);

      if (index < value.length) {
        const newValue = value.slice(0, index);

        onChange(newValue);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    const digitPattern = new RegExp(`^\\d{${length}}$`);

    if (digitPattern.test(pasteData)) {
      handleOtpChange(pasteData);
    }
  };

  return (
    <div className="relative mb-6">
      {/* Hidden input for actual typing */}
      <input
        ref={hiddenInputRef}
        autoComplete="one-time-code"
        className="absolute opacity-0 pointer-events-none"
        inputMode="numeric"
        maxLength={length}
        type="text"
        value={value}
        onChange={(e) => handleOtpChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onPaste={handlePaste}
      />

      {/* Visual OTP boxes */}
      <div className="flex gap-3 justify-center">
        {otpArray.map((digit, index) => (
          <div
            key={index}
            aria-label={`OTP digit ${index + 1} of ${length}`}
            className={`
              w-14 h-14
              border-2 rounded-xl
              flex items-center justify-center
              text-xl font-semibold
              cursor-pointer
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-[#3C5A3A]/30
              ${
                focusedIndex === index
                  ? "border-[#3C5A3A] bg-[#3C5A3A]/5 ring-2 ring-[#3C5A3A]/20"
                  : digit.trim()
                    ? "border-[#3C5A3A] bg-[#3C5A3A]/10"
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
            {digit.trim() && <span className="text-gray-800">{digit}</span>}
            {focusedIndex === index && !digit.trim() && (
              <div className="w-0.5 h-6 bg-[#3C5A3A] animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};