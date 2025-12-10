"use client";

import { Textarea, Button } from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface BodyFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
  onNext?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function BodyForm({
  section,
  onSectionChange,
  onNext,
  onPrevious,
  isLoading,
  onValidationChange,
}: BodyFormProps) {
  const previousDataRef = useRef<string>("");
  const [content, setContent] = useState<string>(section?.content || "");

  // Update local state when section content changes from parent
  useEffect(() => {
    if (section?.content) {
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
    [onSectionChange],
  );

  useEffect(() => {
    if (content !== section?.content) {
      debouncedSync(content);
    }
  }, [content, section?.content, debouncedSync]);

  const CHARACTER_LIMIT = 1200;

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
        <h2 className="text-2xl font-semibold mt-4">Body</h2>
        <p className="text-sm text-default-500">
          Highlight your relevant experience, skills, and accomplishments. Show
          why you&apos;re a great fit for this position.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={
            content
              ? `${getCharacterCount(content)}/${CHARACTER_LIMIT} characters ${remainingChars >= 0 ? `(${remainingChars} remaining)` : `(${Math.abs(remainingChars)} over limit)`}`
              : `Write the main body (max ${CHARACTER_LIMIT} characters)`
          }
          errorMessage={
            isOverLimit ? "Body is too long. Please shorten your text." : ""
          }
          isInvalid={isOverLimit}
          label="Body"
          maxLength={CHARACTER_LIMIT + 100} // Allow some overflow for editing
          minRows={10}
          placeholder="Write your main body content here. Include relevant experience, skills, and why you're interested in the role..."
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
            onPress={onNext}
          >
            {isLoading
              ? "Saving..."
              : isOverLimit
                ? "Character limit exceeded"
                : "Proceed to Conclusion"}
          </Button>
          <button
            className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-all duration-200 ease-in-out hover:underline underline-offset-2"
            disabled={isLoading}
            type="button"
            onClick={onPrevious}
          >
            Back to Introduction
          </button>
        </div>
      </form>
    </div>
  );
}
