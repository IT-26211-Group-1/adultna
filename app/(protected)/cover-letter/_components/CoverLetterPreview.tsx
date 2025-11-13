"use client";

import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRef, useState, useCallback } from "react";
import useDimensions from "@/hooks/useDimensions";
import { Mail } from "lucide-react";
import type { CoverLetterSection } from "@/types/cover-letter";

interface CoverLetterPreviewProps {
  sections: CoverLetterSection[];
  className?: string;
  onSectionUpdate?: (sectionId: string, content: string) => void;
}

export function CoverLetterPreview({
  sections,
  className,
  onSectionUpdate,
}: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);
  const [editingSection, setEditingSection] = useState<string | null>(null);

  const handleBlur = useCallback(
    (sectionId: string, newContent: string) => {
      if (onSectionUpdate) {
        onSectionUpdate(sectionId, newContent);
      }
      setEditingSection(null);
    },
    [onSectionUpdate]
  );

  return (
    <div
      ref={containerRef}
      className={cn("aspect-[210/297] h-fit w-full bg-white", className)}
    >
      <Card className="shadow-lg w-full h-full rounded-lg">
        <CardBody
          className={cn("p-0", !width && "invisible")}
          style={{
            zoom: (1 / 794) * width,
          }}
        >
          <div className="w-[794px] h-[1123px] bg-white p-16 space-y-6 text-gray-900">
            {/* Cover Letter Content */}
            <div className="space-y-4 text-sm leading-relaxed">
              {sections.length > 0 ? (
                sections.map((section) => (
                  <div
                    key={section.id}
                    className={cn(
                      "text-justify outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded px-2 py-1 -mx-2 -my-1 transition-all",
                      editingSection === section.id && "bg-blue-50"
                    )}
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={() => setEditingSection(section.id || null)}
                    onBlur={(e) => {
                      if (section.id) {
                        handleBlur(
                          section.id,
                          e.currentTarget.textContent || ""
                        );
                      }
                    }}
                  >
                    {section.content}
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-32 text-gray-300">
                  <Mail className="w-24 h-24" strokeWidth={1.5} />
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
