"use client";

import { memo } from "react";
import { Button } from "@nextui-org/react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcherComponent = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: "en" | "fil") => {
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <div
      className="flex items-center gap-2"
      role="group"
      aria-label="Language selection"
    >
      <Button
        size="sm"
        variant={language === "en" ? "solid" : "bordered"}
        color={language === "en" ? "success" : "default"}
        onPress={() => handleLanguageChange("en")}
        aria-label={language === "en" ? "English (current)" : "Switch to English"}
        aria-pressed={language === "en"}
        className={
          language === "en"
            ? "bg-adult-green text-white"
            : "border-adult-green text-adult-green hover:bg-adult-green/10"
        }
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={language === "fil" ? "solid" : "bordered"}
        color={language === "fil" ? "success" : "default"}
        onPress={() => handleLanguageChange("fil")}
        aria-label={language === "fil" ? "Filipino (current)" : "Switch to Filipino"}
        aria-pressed={language === "fil"}
        className={
          language === "fil"
            ? "bg-adult-green text-white"
            : "border-adult-green text-adult-green hover:bg-adult-green/10"
        }
      >
        FIL
      </Button>
    </div>
  );
};

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
