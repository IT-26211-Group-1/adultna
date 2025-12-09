"use client";

import { Textarea, Button } from "@heroui/react";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface SignatureFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
  onFinish?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function SignatureForm({
  section,
  onSectionChange,
  onFinish,
  onPrevious,
  isLoading,
  onValidationChange,
}: SignatureFormProps) {
  const previousDataRef = useRef<string>("");
  const [content, setContent] = useState<string>(section?.content || "");

  // Initialize previousDataRef on mount
  useEffect(() => {
    if (previousDataRef.current === "" && section?.content !== undefined) {
      previousDataRef.current = section.content;
    }
  }, []);

  // Update local state when section content changes from parent
  useEffect(() => {
    if (section?.content !== undefined) {
      const currentData = section.content;

      if (previousDataRef.current !== currentData) {
        setContent(currentData);
        previousDataRef.current = currentData;
      }
    }
  }, [section?.content]);

  const debouncedSync = useMemo(
    () =>
      debounce((newContent: string) => {
        onSectionChange(newContent);
      }, 300),
    [onSectionChange]
  );

  useEffect(() => {
    if (content !== section?.content) {
      debouncedSync(content);
    }
  }, [content, section?.content, debouncedSync]);

  // Function to flush pending changes immediately
  const flushChanges = useCallback(() => {
    if (content !== section?.content) {
      debouncedSync.cancel();
      onSectionChange(content);
    }
  }, [content, section?.content, debouncedSync, onSectionChange]);

  // Handle finish with immediate sync
  const handleFinishClick = useCallback(() => {
    flushChanges();
    if (onFinish) {
      setTimeout(() => {
        onFinish();
      }, 0);
    }
  }, [flushChanges, onFinish]);

  const CHARACTER_LIMIT = 100;

  const getCharacterCount = (text: string): number => {
    return text.length;
  };

  const isOverLimit = content.length > CHARACTER_LIMIT;
  const remainingChars = CHARACTER_LIMIT - content.length;

  // Notify parent component about validation state
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(!isOverLimit);
    }
  }, [isOverLimit, onValidationChange]);

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold mt-4">Signature</h2>
        <p className="text-sm text-default-500">
          Add your professional sign-off and name. You can sign the PDF manually
          later.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={
            content
              ? `${getCharacterCount(content)}/${CHARACTER_LIMIT} characters ${remainingChars >= 0 ? `(${remainingChars} remaining)` : `(${Math.abs(remainingChars)} over limit)`}`
              : `Write your signature (max ${CHARACTER_LIMIT} characters)`
          }
          errorMessage={
            isOverLimit
              ? "Signature is too long. Please shorten your text."
              : ""
          }
          isInvalid={isOverLimit}
          label="Signature"
          maxLength={CHARACTER_LIMIT + 20} // Allow some overflow for editing
          minRows={3}
          placeholder="Sincerely,&#10;[Your Name]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Navigation Buttons */}
        <div className="flex flex-col items-center gap-3 pt-6">
          <Button
            disableAnimation
            className={`${
              isOverLimit
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800"
            } text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-0 font-medium min-w-40`}
            isDisabled={isOverLimit || isLoading}
            isLoading={isLoading}
            size="md"
            onPress={handleFinishClick}
          >
            {isLoading
              ? "Saving..."
              : isOverLimit
                ? "Character limit exceeded"
                : "Complete Cover Letter"}
          </Button>
          <button
            className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-all duration-200 ease-in-out hover:underline underline-offset-2"
            disabled={isLoading}
            type="button"
            onClick={onPrevious}
          >
            Back to Conclusion
          </button>
        </div>
      </form>
    </div>
  );
}
