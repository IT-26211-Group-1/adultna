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
  Languages,
} from "lucide-react";
import Link from "next/link";
import { Card, CardBody } from "@heroui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import type { TranslatedGuideResponse } from "@/hooks/queries/useGovGuidesQueries";

type GuideCardProps = {
  guide: GovGuide;
  translation?: TranslatedGuideResponse;
  isTranslating?: boolean;
};

export default function GuideCard({
  guide,
  translation,
  isTranslating,
}: GuideCardProps) {
  const { language, t } = useLanguage();

  const displayTitle = translation?.title || guide.title;
  const displaySummary =
    translation?.description ||
    guide.summary ||
    `${t("common.completeGuideFor")} ${displayTitle}`;

  const getCategoryConfig = (category: string) => {
    const configs = {
      identification: {
        icon: Shield,
        labelKey: "guides.category.identification",
        className:
          "border border-adult-green text-adult-green bg-adult-green/5",
      },
      "civil-registration": {
        icon: FileText,
        labelKey: "guides.category.civil-registration",
        className: "border border-olivine text-olivine bg-olivine/5",
      },
      "permits-licenses": {
        icon: CreditCard,
        labelKey: "guides.category.permits-licenses",
        className:
          "border border-crayola-orange text-crayola-orange bg-crayola-orange/5",
      },
      "social-services": {
        icon: Users,
        labelKey: "guides.category.social-services",
        className:
          "border border-adult-green text-adult-green bg-adult-green/5",
      },
      "tax-related": {
        icon: Building,
        labelKey: "guides.category.tax-related",
        className:
          "border border-ultra-violet text-ultra-violet bg-ultra-violet/5",
      },
      legal: {
        icon: Scale,
        labelKey: "guides.category.legal",
        className:
          "border border-periwinkle text-ultra-violet bg-periwinkle/10",
      },
      other: {
        icon: Folder,
        labelKey: "guides.category.other",
        className: "border border-gray-300 text-gray-600 bg-gray-50",
      },
    };

    const config = configs[category as keyof typeof configs] || {
      icon: Folder,
      labelKey: "guides.category.other",
      className: "border border-gray-300 text-gray-600 bg-gray-50",
    };

    return {
      ...config,
      label: t(config.labelKey),
    };
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
            {/* Title with Language Indicator */}
            <div className="flex items-start gap-2 mb-3">
              <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 flex-1">
                {isTranslating && !translation ? (
                  <span className="text-gray-400">{guide.title}</span>
                ) : (
                  displayTitle
                )}
              </h3>
              {language === "fil" && (
                <div className="flex-shrink-0">
                  {isTranslating && !translation ? (
                    <div className="w-4 h-4 border-2 border-adult-green border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <Languages
                      aria-label="Tagalog translation"
                      className="w-4 h-4 text-adult-green"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-3" />

            {/* Summary */}
            <p className="text-xs text-gray-600 mb-4 line-clamp-2 flex-1">
              {isTranslating && !translation ? (
                <span className="text-gray-400">
                  {guide.summary ||
                    `Complete guide for applying for your ${guide.title}`}
                </span>
              ) : (
                displaySummary
              )}
            </p>

            {/* Requirements */}
            <div className="mb-3">
              <div className="text-xs text-gray-500">
                {guide.requirements && guide.requirements.length > 0
                  ? `${guide.requirements.length} ${guide.requirements.length > 1 ? t("common.requirements") : t("common.requirement")}`
                  : t("common.noRequirements")}
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
                {t("common.viewDetails")}
                <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
