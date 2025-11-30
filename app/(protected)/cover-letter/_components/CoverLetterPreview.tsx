"use client";

import { cn } from "@/lib/utils";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";
import { Mail } from "lucide-react";
import { Card, CardBody } from "@heroui/react";
import type { CoverLetterSection } from "@/types/cover-letter";

interface CoverLetterPreviewProps {
  sections: CoverLetterSection[];
  className?: string;
}

export function CoverLetterPreview({
  sections,
  className,
}: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

  return (
    <div
      ref={containerRef}
      className={cn("w-full h-full flex items-center justify-center p-4", className)}
    >
      <div className="h-full aspect-[210/297] max-w-full">
        <Card className="shadow-lg w-full h-full rounded-lg overflow-hidden">
          <CardBody
            className={cn("p-0", !width && "invisible")}
            style={{
              zoom: width ? Math.min(width / 650, (containerRef.current?.clientHeight || 800) / 842) : 1,
            }}
          >
            <div className="w-[650px] h-[842px] bg-white p-16 pb-24 space-y-6 text-gray-900">
              {/* Cover Letter Content */}
              <div className="space-y-6 text-sm leading-relaxed pb-16">
                {sections.length > 0 ? (
                  sections.map((section) => {
                    const sectionLabels = {
                      intro: "Introduction",
                      body: "Body",
                      conclusion: "Conclusion",
                      signature: "Signature",
                    };
                    const label =
                      sectionLabels[
                        section.sectionType as keyof typeof sectionLabels
                      ];

                    return (
                      <div key={section.sectionType} className="space-y-1">
                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                          {label}
                        </div>
                        <div className="text-justify whitespace-pre-wrap">
                          {section.content}
                        </div>
                      </div>
                    );
                  })
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
    </div>
  );
}
