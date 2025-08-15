import React, { createContext, useContext, useState, useEffect } from 'react';
// Import base translations
import enCommon from '../locales/en/common.json';
import arCommon from '../locales/ar/common.json';
// Import filter translations
import enFilters from '../locales/en/filters.json';
import arFilters from '../locales/ar/filters.json';

type Language = 'ar' | 'en';

type NestedObject = {
  [key: string]: string | NestedObject;
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, defaultValue?: string) => string;
  tNested: (key: string) => NestedObject;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Define the shape of our translations
interface Translations {
  [key: string]: any; // Allow string indexing for dynamic keys
  en: {
    [key: string]: any;
    filters: typeof enFilters;
  };
  ar: {
    [key: string]: any;
    filters: typeof arFilters;
  };
}

// Merge all translations
const translations: Translations = {
  en: {
    ...enCommon,
    filters: enFilters,
  },
  ar: {
    ...arCommon,
    filters: arFilters,
  }
};

// Track missing translation keys to avoid spamming the console with repeats
const warnedMissingKeys = new Set<string>();

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'ar';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
  }, [language]);

  const t = (key: string, defaultValue: string = ''): string => {
    // First try to get the direct translation
    const directResult = translations[language]?.[key];
    if (directResult && typeof directResult === 'string') {
      return directResult;
    }

    // If not found, try nested lookup
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result === undefined || result === null) break;
      result = result[k];
    }
    
    if (typeof result === 'string') {
      return result;
    }

    // Missing translation: return default or key and warn once
    const fallback = defaultValue || key;
    const warnKey = `${language}:${key}`;
    if (!warnedMissingKeys.has(warnKey)) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] Missing translation for key "${key}" in locale "${language}". Fallback: "${fallback}"`);
      warnedMissingKeys.add(warnKey);
    }
    return fallback;
  };

  const tNested = (key: string): NestedObject => {
    const value = t(key);
    return typeof value === 'object' ? value : {};
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tNested }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};