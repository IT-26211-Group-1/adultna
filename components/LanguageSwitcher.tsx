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
      aria-label="Language selection"
      className="flex items-center gap-2"
      role="group"
    >
      <Button
        aria-label={
          language === "en" ? "English (current)" : "Switch to English"
        }
        aria-pressed={language === "en"}
        className={
          language === "en"
            ? "bg-adult-green text-white"
            : "border-adult-green text-adult-green hover:bg-adult-green/10"
        }
        color={language === "en" ? "success" : "default"}
        size="sm"
        variant={language === "en" ? "solid" : "bordered"}
        onPress={() => handleLanguageChange("en")}
      >
        EN
      </Button>
      <Button
        aria-label={
          language === "fil" ? "Filipino (current)" : "Switch to Filipino"
        }
        aria-pressed={language === "fil"}
        className={
          language === "fil"
            ? "bg-adult-green text-white"
            : "border-adult-green text-adult-green hover:bg-adult-green/10"
        }
        color={language === "fil" ? "success" : "default"}
        size="sm"
        variant={language === "fil" ? "solid" : "bordered"}
        onPress={() => handleLanguageChange("fil")}
      >
        FIL
      </Button>
    </div>
  );
};

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
