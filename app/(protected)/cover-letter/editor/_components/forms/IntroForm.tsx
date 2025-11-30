"use client";

import { Textarea, Button } from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface IntroFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
  onNext?: () => void;
  isLoading?: boolean;
  onValidationChange?: (isValid: boolean) => void;
}

export default function IntroForm({
  section,
  onSectionChange,
  onNext,
  isLoading,
  onValidationChange,
}: IntroFormProps) {
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

  const CHARACTER_LIMIT = 800;

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
    <div className="ml-auto mr-8 max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold mt-4">Introduction</h2>
        <p className="text-sm text-default-500">
          Start with a strong opening that includes a greeting and introduces
          yourself and the position you&apos;re applying for.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={
            content
              ? `${getCharacterCount(content)}/${CHARACTER_LIMIT} characters ${remainingChars >= 0 ? `(${remainingChars} remaining)` : `(${Math.abs(remainingChars)} over limit)`}`
              : `Write your introduction (max ${CHARACTER_LIMIT} characters)`
          }
          errorMessage={isOverLimit ? "Introduction is too long. Please shorten your text." : ""}
          isInvalid={isOverLimit}
          label="Introduction"
          maxLength={CHARACTER_LIMIT + 50} // Allow some overflow for editing
          minRows={6}
          placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my strong interest in..."
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
            {isLoading ? "Saving..." : isOverLimit ? "Character limit exceeded" : "Proceed to Body"}
          </Button>
        </div>
      </form>
    </div>
  );
}
