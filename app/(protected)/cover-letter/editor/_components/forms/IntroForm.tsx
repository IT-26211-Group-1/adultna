"use client";

import { Textarea } from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface IntroFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
}

export default function IntroForm({
  section,
  onSectionChange,
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

  const getCharacterCount = (text: string): number => {
    return text.length;
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <div className="space-y-1.5 text-center">
        <h2 className="text-2xl font-semibold">Introduction</h2>
        <p className="text-sm text-default-500">
          Start with a strong opening that includes a greeting and introduces
          yourself and the position you&apos;re applying for.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={`${content ? `${getCharacterCount(content)} characters` : "Write your introduction"}`}
          label="Introduction"
          minRows={6}
          placeholder="Dear Hiring Manager,&#10;&#10;I am writing to express my strong interest in..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}
