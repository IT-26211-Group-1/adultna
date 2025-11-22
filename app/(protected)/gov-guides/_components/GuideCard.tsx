"use client";

import { GovGuide } from "@/types/govguide";
import {
  ChevronRight,
  FileText,
  Users,
  CreditCard,
  Shield,
  Building,
  Scale,
  Folder,
} from "lucide-react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";

type GuideCardProps = {
  guide: GovGuide;
};

export default function GuideCard({ guide }: GuideCardProps) {
  const getCategoryConfig = (category: string) => {
    const configs = {
      identification: {
        icon: Shield,
        label: "Government IDs",
        className:
          "border border-adult-green text-adult-green bg-adult-green/5",
      },
      "civil-registration": {
        icon: FileText,
        label: "Civil Registration",
        className: "border border-olivine text-olivine bg-olivine/5",
      },
      "permits-licenses": {
        icon: CreditCard,
        label: "Permits & Licenses",
        className:
          "border border-crayola-orange text-crayola-orange bg-crayola-orange/5",
      },
      "social-services": {
        icon: Users,
        label: "Social Services",
        className:
          "border border-adult-green text-adult-green bg-adult-green/5",
      },
      "tax-related": {
        icon: Building,
        label: "Tax-Related",
        className:
          "border border-ultra-violet text-ultra-violet bg-ultra-violet/5",
      },
      legal: {
        icon: Scale,
        label: "Legal Documents",
        className:
          "border border-periwinkle text-ultra-violet bg-periwinkle/10",
      },
      other: {
        icon: Folder,
        label: "Other",
        className: "border border-gray-300 text-gray-600 bg-gray-50",
      },
    };

    return (
      configs[category as keyof typeof configs] || {
        icon: Folder,
        label: category,
        className: "border border-gray-300 text-gray-600 bg-gray-50",
      }
    );
  };

  const categoryConfig = getCategoryConfig(guide.category);
  const IconComponent = categoryConfig.icon;

  return (
    <div className="group">
      <Card
        disableAnimation
        className="border border-gray-200 w-full h-full bg-white shadow-none"
      >
        <CardBody className="p-4 min-h-[200px]">
          <div className="flex flex-col h-full">
            {/* Title */}
            <h3 className="text-sm font-semibold text-gray-900 mb-3 line-clamp-2">
              {guide.title}
            </h3>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-3" />

            {/* Summary */}
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 flex-1">
              {guide.summary ||
                `Complete guide for applying for your ${guide.title}`}
            </p>

            {/* Requirements */}
            <div className="mb-3">
              <div className="text-xs text-gray-500">
                {guide.requirements && guide.requirements.length > 0
                  ? `${guide.requirements.length} requirement${guide.requirements.length > 1 ? "s" : ""}`
                  : "No requirements"}
              </div>
            </div>

            {/* Category Tag and Action */}
            <div className="flex items-end justify-between">
              <div
                className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${categoryConfig.className}`}
              >
                <IconComponent className="w-3 h-3" />
                {categoryConfig.label}
              </div>

              <Link
                className="inline-flex items-center gap-1 text-adult-green hover:text-green-600 font-medium text-xs transition-colors group"
                href={`/gov-guides/${guide.slug}`}
              >
                View Details
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
