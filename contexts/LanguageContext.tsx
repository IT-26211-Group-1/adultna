"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "en" | "fil";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
};

const translations = {
  en: {
    common: {
      submit: "Submit",
      cancel: "Cancel",
      save: "Save",
      edit: "Edit",
      delete: "Delete",
      loading: "Loading...",
      error: "An error occurred",
      success: "Success!",
      search: "Search",
      categories: "Categories",
      all: "All",
    },
    nav: {
      dashboard: "Dashboard",
      guides: "Guides",
      profile: "Profile",
      settings: "Settings",
    },
    guides: {
      hero: {
        title: "Your guide to adulting in the Philippines!",
        description: "Hey there, future adult! We know government processes can feel overwhelming, but we've got your back. Find step-by-step guides that make getting your documents simple and stress-free.",
      },
      search: {
        placeholder: "Search guides...",
      },
      category: {
        all: "All Categories",
        identification: "Identification",
        "civil-registration": "Civil Registration",
        "permits-licenses": "Permits & Licenses",
        "social-services": "Social Services",
        "tax-related": "Tax Related",
        legal: "Legal",
        other: "Other",
      },
      noResults: "No guides found matching your criteria.",
      noGuides: "No guides available at the moment.",
    },
  },
  fil: {
    common: {
      submit: "Isumite",
      cancel: "Kanselahin",
      save: "I-save",
      edit: "Baguhin",
      delete: "Tanggalin",
      loading: "Naglo-load...",
      error: "May naganap na error",
      success: "Tagumpay!",
      search: "Maghanap",
      categories: "Mga Kategorya",
      all: "Lahat",
    },
    nav: {
      dashboard: "Dashboard",
      guides: "Mga Gabay",
      profile: "Profile",
      settings: "Mga Setting",
    },
    guides: {
      hero: {
        title: "Ang iyong gabay sa pagiging adulto sa Pilipinas!",
        description: "Kamusta, future adult! Alam namin na ang mga proseso ng gobyerno ay maaaring nakakabigla, ngunit nandito kami para sa iyo. Maghanap ng step-by-step na gabay na ginagawang simple at walang stress ang pagkuha ng iyong mga dokumento.",
      },
      search: {
        placeholder: "Maghanap ng mga gabay...",
      },
      category: {
        all: "Lahat ng Kategorya",
        identification: "Pagkakakilanlan",
        "civil-registration": "Rehistro Sibil",
        "permits-licenses": "Mga Permit at Lisensya",
        "social-services": "Mga Serbisyong Panlipunan",
        "tax-related": "Kaugnay ng Buwis",
        legal: "Legal",
        other: "Iba Pa",
      },
      noResults: "Walang nahanap na gabay na tumutugma sa iyong criteria.",
      noGuides: "Walang available na gabay sa ngayon.",
    },
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedLanguage = localStorage.getItem("adultna-language") as Language;
    console.log("Loading saved language:", savedLanguage);
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "fil")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    console.log("Setting language to:", lang);
    setLanguageState(lang);
    if (mounted) {
      localStorage.setItem("adultna-language", lang);
    }
  };

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];

    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) break;
    }

    return value || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
