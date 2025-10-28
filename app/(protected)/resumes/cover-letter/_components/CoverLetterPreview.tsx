"use client";

import { Card, CardBody } from "@heroui/react";
import { cn } from "@/lib/utils";
import { useRef } from "react";
import useDimensions from "@/hooks/useDimensions";

interface CoverLetterPreviewProps {
  content: string[];
  className?: string;
}

export function CoverLetterPreview({
  content,
  className,
}: CoverLetterPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { width } = useDimensions(containerRef);

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
              {content.length > 0 ? (
                content.map((paragraph, index) => (
                  <p key={index} className="text-justify">
                    {paragraph}
                  </p>
                ))
              ) : (
                <div className="text-center py-16 text-gray-400">
                  <p className="text-xs mt-2">
                    Click &quot;Generate AI Cover Letter&quot; to add content.
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
