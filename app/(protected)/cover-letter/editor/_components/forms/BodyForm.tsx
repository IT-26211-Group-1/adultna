"use client";

import { Textarea } from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface BodyFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
}

export default function BodyForm({ section, onSectionChange }: BodyFormProps) {
  const [content, setContent] = useState<string>(section?.content || "");

  // Update local state when section content changes from parent
  useEffect(() => {
    if (section?.content !== undefined && section?.content !== content) {
      setContent(section.content);
    }
  }, [section?.content, content]);

  const debouncedSync = useMemo(
    () => debounce((newContent: string) => {
      onSectionChange(newContent);
    }, 300),
    [onSectionChange]
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
        <h2 className="text-2xl font-semibold">Body</h2>
        <p className="text-sm text-default-500">
          Highlight your relevant experience, skills, and accomplishments. Show why you're a great fit for this position.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          description={`${content ? `${getCharacterCount(content)} characters` : "Write the main body"}`}
          disableAnimation
          label="Body"
          minRows={10}
          placeholder="Write your main body content here. Include relevant experience, skills, and why you're interested in the role..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}
