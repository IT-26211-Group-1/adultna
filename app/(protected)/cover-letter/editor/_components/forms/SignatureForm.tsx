"use client";

import { Textarea } from "@heroui/react";
import { useState, useEffect, useMemo, useRef } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface SignatureFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
}

export default function SignatureForm({ section, onSectionChange }: SignatureFormProps) {
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
        <h2 className="text-2xl font-semibold">Signature</h2>
        <p className="text-sm text-default-500">
          Add your professional sign-off and name. You can sign the PDF manually later.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          description={`${content ? `${getCharacterCount(content)} characters` : "Write your signature"}`}
          disableAnimation
          label="Signature"
          minRows={3}
          placeholder="Sincerely,&#10;[Your Name]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </form>
    </div>
  );
}
