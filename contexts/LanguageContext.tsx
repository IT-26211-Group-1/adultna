"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from "react";

export type Language = "en" | "fil";

type TranslationData = Record<string, any>;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "adultna_language";

const loadTranslations = async (lang: Language): Promise<TranslationData> => {
  try {
    const translations = await import(`@/translations/${lang}.json`);
    return translations.default;
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    return {};
  }
};

const getStoredLanguage = (): Language => {
  if (typeof window === "undefined") return "en";

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "fil") {
      return stored;
    }
  } catch (error) {
    console.error("Failed to read language from localStorage:", error);
  }

  return "en";
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(getStoredLanguage);
  const [translations, setTranslations] = useState<TranslationData | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadLanguageData = async () => {
      setIsLoading(true);
      const data = await loadTranslations(language);

      if (isMounted) {
        setTranslations(data);
        setIsLoading(false);
      }
    };

    loadLanguageData();

    return () => {
      isMounted = false;
    };
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);

    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (error) {
      console.error("Failed to save language to localStorage:", error);
    }
  }, []);

  const t = useMemo(
    () => (key: string): string => {
      if (isLoading || !translations) return key;

      const keys = key.split(".");
      let value: any = translations;

      for (const k of keys) {
        value = value?.[k];
        if (value === undefined) break;
      }

      return value || key;
    },
    [translations, isLoading],
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isLoading,
    }),
    [language, setLanguage, t, isLoading],
  );

  return (
    <LanguageContext.Provider value={value}>
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
