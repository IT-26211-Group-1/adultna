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
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { logger } from "@/lib/logger";

export type Language = "en" | "fil";

type TranslationData = Record<string, any>;

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  isLoading: boolean;
};

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const STORAGE_KEY = "adultna_language";

const loadTranslations = async (lang: Language): Promise<TranslationData> => {
  try {
    const translations = await import(`@/translations/${lang}.json`);

    return translations.default;
  } catch (error) {
    logger.error(`Failed to load translations for ${lang}:`, error);

    return {};
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const getInitialLanguage = (): Language => {
    if (typeof window === "undefined") return "en";

    const urlLang = searchParams?.get("lang");

    if (urlLang === "en" || urlLang === "fil") {
      return urlLang;
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);

      if (stored === "en" || stored === "fil") {
        return stored;
      }
    } catch (error) {
      logger.error("Failed to read language from localStorage:", error);
    }

    return "en";
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);
  const [translations, setTranslations] = useState<TranslationData | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlLang = searchParams?.get("lang");
    const isGovGuidesPage = pathname?.startsWith("/gov-guides");

    if (urlLang === "en" || urlLang === "fil") {
      if (urlLang !== language) {
        setLanguageState(urlLang);
      }
    } else if (
      isGovGuidesPage &&
      pathname &&
      typeof window !== "undefined" &&
      !urlLang
    ) {
      const params = new URLSearchParams(searchParams?.toString());

      params.set("lang", language);
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [searchParams, language, pathname, router]);

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

  const setLanguage = useCallback(
    (lang: Language) => {
      setLanguageState(lang);

      try {
        localStorage.setItem(STORAGE_KEY, lang);
      } catch (error) {
        logger.error("Failed to save language to localStorage:", error);
      }

      const isGovGuidesPage = pathname?.startsWith("/gov-guides");

      if (isGovGuidesPage && pathname) {
        const params = new URLSearchParams(searchParams?.toString());

        params.set("lang", lang);
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      }
    },
    [pathname, searchParams, router]
  );

  const t = useMemo(
    () =>
      (key: string): string => {
        if (isLoading || !translations) return key;

        const keys = key.split(".");
        let value: any = translations;

        for (const k of keys) {
          value = value?.[k];
          if (value === undefined) break;
        }

        return value || key;
      },
    [translations, isLoading]
  );

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      t,
      isLoading,
    }),
    [language, setLanguage, t, isLoading]
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
