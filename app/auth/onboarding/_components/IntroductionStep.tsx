import React, { memo, useCallback, useState } from "react";
import { ChevronRight } from "lucide-react";
import { IntroductionStepProps } from "@/types/onboarding";

function IntroductionStep({
  displayName,
  setDisplayName,
  onNext,
}: IntroductionStepProps) {
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const MAX_DISPLAY_NAME_LENGTH = 30;

  const validateDisplayName = useCallback((name: string) => {
    if (!name.trim()) {
      return "Please enter your display name";
    }

    if (name.length > MAX_DISPLAY_NAME_LENGTH) {
      return `Display name must be ${MAX_DISPLAY_NAME_LENGTH} characters or less`;
    }

    // Only allow letters, numbers, and spaces
    const validPattern = /^[a-zA-Z0-9\s]+$/;
    if (!validPattern.test(name)) {
      return "Display name can only contain letters, numbers, and spaces";
    }

    return "";
  }, []);

  const handleSubmit = useCallback(() => {
    const error = validateDisplayName(displayName);
    if (!error) {
      setShowError(false);
      setErrorMessage("");
      onNext();
    } else {
      setShowError(true);
      setErrorMessage(error);
    }
  }, [displayName, onNext, validateDisplayName]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDisplayName(value);

    if (showError) {
      const error = validateDisplayName(value);
      if (!error) {
        setShowError(false);
        setErrorMessage("");
      } else {
        setErrorMessage(error);
      }
    }
  }, [setDisplayName, showError, validateDisplayName]);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">
        Let's get started!
      </h2>
      <p className="text-gray-600 mb-8">What should we call you?</p>

      <div className="space-y-2">
        <div className="flex justify-center">
          <input
            className={`w-full max-w-md px-4 py-3 border rounded-full focus:ring-1 outline-none transition-colors ${
              showError
                ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                : "border-gray-300 focus:ring-teal-500 focus:border-teal-500"
            }`}
            placeholder="Enter your display name"
            type="text"
            value={displayName}
            maxLength={MAX_DISPLAY_NAME_LENGTH}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
        </div>

        {/* Character counter */}
        <div className="flex justify-center">
          <div className="w-full max-w-md flex justify-end">
            <p className={`text-xs ${
              displayName.length > MAX_DISPLAY_NAME_LENGTH * 0.8
                ? "text-orange-500"
                : "text-gray-400"
            }`}>
              {displayName.length}/{MAX_DISPLAY_NAME_LENGTH}
            </p>
          </div>
        </div>

        {showError && (
          <div className="flex justify-center">
            <p className="text-red-500 text-sm max-w-md">
              {errorMessage}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default memo(IntroductionStep);
