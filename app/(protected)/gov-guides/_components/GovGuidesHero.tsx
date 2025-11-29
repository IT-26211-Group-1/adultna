"use client";

import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function GovGuidesHero() {
  const { t } = useLanguage();
  const [showDecorations, setShowDecorations] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && "requestIdleCallback" in window) {
      requestIdleCallback(() => setShowDecorations(true));
    } else {
      const timeout = setTimeout(() => setShowDecorations(true), 100);
      return () => clearTimeout(timeout);
    }
  }, []);

  return (
    <div className="mx-4 sm:mx-6 lg:mx-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-ivory via-peach-yellow/20 to-olivine/10 rounded-2xl">
        {/* Background decorative elements - lazy loaded */}
        {showDecorations && (
          <div className="absolute inset-0">
            <div className="absolute top-3 right-6 w-1.5 h-1.5 bg-olivine/40 rounded-full opacity-60" />
            <div className="absolute top-8 right-10 w-1 h-1 bg-crayola-orange/30 rounded-full opacity-80" />
            <div className="absolute top-6 right-16 w-1 h-1 bg-olivine/50 rounded-full opacity-70" />
            <div className="absolute top-10 right-20 w-0.5 h-0.5 bg-peach-yellow/60 rounded-full opacity-60" />
            <div className="absolute bottom-4 right-8 w-1.5 h-1.5 bg-olivine/30 rounded-full opacity-50" />
            <div className="absolute bottom-6 right-12 w-0.5 h-0.5 bg-crayola-orange/20 rounded-full opacity-70" />
          </div>
        )}

        <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-6 sm:py-8">
          <div className="max-w-2xl">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-adult-green mb-2 leading-tight">
              {t("guides.hero.title")}
            </h1>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              {t("guides.hero.description")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
