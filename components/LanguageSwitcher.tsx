"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@heroui/button";

export function LanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (lang: "en" | "fil") => {
    setLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        size="sm"
        variant={language === "en" ? "solid" : "light"}
        onPress={() => handleLanguageChange("en")}
      >
        EN
      </Button>
      <Button
        size="sm"
        variant={language === "fil" ? "solid" : "light"}
        onPress={() => handleLanguageChange("fil")}
      >
        FIL
      </Button>
    </div>
  );
}
