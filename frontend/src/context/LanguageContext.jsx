import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../data/translations';
import { getLocalizedPlaceName } from '../data/placeTranslations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem('REDZONE_LANG') || 'en';
  });

  const setLanguage = (langCode) => {
    if (translations[langCode]) {
      setCurrentLang(langCode);
      localStorage.setItem('REDZONE_LANG', langCode);
    }
  };

  const t = (key) => {
    const langDict = translations[currentLang] || translations.en;
    return langDict[key] || translations.en[key] || key;
  };

  const localizePlace = (placeName) => {
    return getLocalizedPlaceName(placeName, currentLang);
  };

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        setLanguage,
        t,
        localizePlace,
        availableLanguages: Object.keys(translations).map(k => ({
          code: k,
          name: translations[k].name,
          flag: translations[k].flag,
        })),
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
