'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';
import { Locale, Direction, t as translate, getDirection, getSavedLocale, saveLocale } from '@/lib/i18n';

interface I18nContextType {
  locale: Locale;
  direction: Direction;
  setLocale: (locale: Locale) => void;
  toggleLocale: () => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  isRTL: boolean;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

// Default locale for SSR - matches the server HTML output
const DEFAULT_LOCALE: Locale = 'ar';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(DEFAULT_LOCALE);
  const initialized = useRef(false);

  useEffect(() => {
    // Only run once on client-side mount
    if (!initialized.current) {
      initialized.current = true;
      const saved = getSavedLocale();
      setLocaleState(saved);
    }
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    saveLocale(newLocale);
  }, []);

  const toggleLocale = useCallback(() => {
    setLocaleState((prev) => {
      const next = prev === 'ar' ? 'en' : 'ar';
      saveLocale(next);
      return next;
    });
  }, []);

  const direction = getDirection(locale);
  const isRTL = direction === 'rtl';

  const tFn = useCallback(
    (key: string, params?: Record<string, string | number>) => {
      return translate(key, locale, params);
    },
    [locale]
  );

  // Sync dir and lang attributes on the html element
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = locale === 'ar' ? 'ar' : 'en';
  }, [direction, locale]);

  return (
    <I18nContext.Provider
      value={{
        locale,
        direction,
        setLocale,
        toggleLocale,
        t: tFn,
        isRTL,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextType {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
