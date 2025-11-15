"use client";

import { Textarea } from "@heroui/react";
import { useState, useEffect, useMemo } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface ConclusionFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
}

export default function ConclusionForm({
  section,
  onSectionChange,
}: ConclusionFormProps) {
  const [content, setContent] = useState<string>(section?.content || "");

  // Update local state when section content changes from parent
  useEffect(() => {
    if (section?.content !== undefined && section?.content !== content) {
      setContent(section.content);
    }
  }, [section?.content, content]);

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
        <h2 className="text-2xl font-semibold">Conclusion</h2>
        <p className="text-sm text-default-500">
          End with a strong closing statement and call to action. Express your
          enthusiasm and next steps.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={`${content ? `${getCharacterCount(content)} characters` : "Write your conclusion"}`}
          label="Conclusion"
          minRows={5}
          placeholder="Thank you for considering my application. I look forward to discussing..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}
