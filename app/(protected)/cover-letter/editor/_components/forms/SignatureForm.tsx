"use client";

import { Textarea, Button } from "@heroui/react";
import { useState, useEffect, useMemo } from "react";
import { debounce } from "@/lib/utils/debounce";
import type { CoverLetterSection } from "@/types/cover-letter";

interface SignatureFormProps {
  section: CoverLetterSection | undefined;
  onSectionChange: (content: string) => void;
  onFinish?: () => void;
  onPrevious?: () => void;
  isLoading?: boolean;
}

export default function SignatureForm({
  section,
  onSectionChange,
  onFinish,
  onPrevious,
  isLoading
}: SignatureFormProps) {
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
        <h2 className="text-2xl font-semibold mt-4">Signature</h2>
        <p className="text-sm text-default-500">
          Add your professional sign-off and name. You can sign the PDF manually
          later.
        </p>
      </div>

      <form className="space-y-6">
        <Textarea
          disableAnimation
          description={`${content ? `${getCharacterCount(content)} characters` : "Write your signature"}`}
          label="Signature"
          minRows={3}
          placeholder="Sincerely,&#10;[Your Name]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        {/* Navigation Buttons */}
        <div className="flex flex-col items-center gap-3 pt-6">
          <Button
            disableAnimation
            className="bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out border-0 font-medium min-w-40"
            isLoading={isLoading}
            size="md"
            onPress={onFinish}
          >
            {isLoading ? "Saving..." : "Complete Cover Letter"}
          </Button>
          <button
            type="button"
            className="text-gray-500 hover:text-emerald-600 text-sm font-medium transition-all duration-200 ease-in-out hover:underline underline-offset-2"
            onClick={onPrevious}
            disabled={isLoading}
          >
            Back to Conclusion
          </button>
        </div>
      </form>
    </div>
  );
}
