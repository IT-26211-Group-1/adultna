"use client";

import { GovGuide } from "@/types/govguide";
import { ChevronRight, Clock } from "lucide-react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";

type GuideCardProps = {
  guide: GovGuide;
};

export default function GuideCard({ guide }: GuideCardProps) {
  return (
    <Link href={`/gov-guides/${guide.slug}`}>
      <Card
        disableAnimation
        isPressable
        className="border border-gray-200 hover:border-adult-green transition-all duration-200 hover:shadow-md"
      >
        <CardBody className="p-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {guide.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {guide.summary ||
                  `Complete guide for applying for your ${guide.title}`}
              </p>
              <div className="text-xs text-gray-500 space-y-1">
                {guide.requirements && guide.requirements.length > 0 && (
                  <div className="flex items-start gap-1">
                    <span className="font-medium min-w-fit">Requirements:</span>
                    <span className="line-clamp-1">
                      {guide.requirements
                        .slice(0, 3)
                        .map((req) => req.name)
                        .join(", ")}
                      {guide.requirements.length > 3 && "..."}
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col items-end gap-2">
              {guide.estimatedProcessingTime && (
                <div className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{guide.estimatedProcessingTime}</span>
                </div>
              )}
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </CardBody>
      </Card>
    </Link>
  );
}
