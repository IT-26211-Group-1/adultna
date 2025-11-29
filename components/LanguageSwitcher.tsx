"use client";

import { memo } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import { Button } from "@heroui/button";
import { Globe } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const LanguageSwitcherComponent = () => {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (key: string | number) => {
    const lang = key as "en" | "fil";
    if (language !== lang) {
      setLanguage(lang);
    }
  };

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="light"
          aria-label="Change language"
          className="text-gray-600 hover:text-adult-green"
        >
          <Globe className="w-5 h-5" />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Language selection"
        selectedKeys={[language]}
        selectionMode="single"
        onSelectionChange={(keys) => {
          const selected = Array.from(keys)[0];
          if (selected) handleLanguageChange(selected);
        }}
      >
        <DropdownItem key="en" className="text-gray-700">
          English
        </DropdownItem>
        <DropdownItem key="fil" className="text-gray-700">
          Filipino
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
};

export const LanguageSwitcher = memo(LanguageSwitcherComponent);
