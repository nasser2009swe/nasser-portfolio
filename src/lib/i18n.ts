import ar from './translations/ar.json';
import en from './translations/en.json';

export type Locale = 'ar' | 'en';
export type Direction = 'rtl' | 'ltr';

export interface TranslationDict {
  [key: string]: string;
}

const translations: Record<Locale, TranslationDict> = { ar, en };

export function getDirection(locale: Locale): Direction {
  return locale === 'ar' ? 'rtl' : 'ltr';
}

/**
 * Get a translation by key. Supports interpolation with {variable} syntax.
 * Falls back to the key itself if not found.
 */
export function t(key: string, locale: Locale, params?: Record<string, string | number>): string {
  const dict = translations[locale];
  let text = dict[key];

  if (!text) {
    // Fallback to English
    text = translations['en'][key];
  }

  if (!text) {
    return key;
  }

  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      text = text!.replace(`{${k}}`, String(v));
    });
  }

  return text;
}

/**
 * Get the HTML lang attribute value
 */
export function getLang(locale: Locale): string {
  return locale === 'ar' ? 'ar' : 'en';
}

/**
 * Detect browser language, default to Arabic
 */
export function detectBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return 'ar';

  try {
    const lang = navigator.language || navigator.languages?.[0] || 'ar';
    if (lang.startsWith('ar')) return 'ar';
    return 'ar'; // Default to Arabic as per requirements
  } catch {
    return 'ar';
  }
}

/**
 * Get saved locale from localStorage, or detect
 */
export function getSavedLocale(): Locale {
  if (typeof window === 'undefined') return 'ar';

  try {
    const saved = localStorage.getItem('portfolio-locale');
    if (saved === 'ar' || saved === 'en') return saved;
  } catch {
    // localStorage not available
  }

  return detectBrowserLanguage();
}

/**
 * Save locale to localStorage
 */
export function saveLocale(locale: Locale): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem('portfolio-locale', locale);
  } catch {
    // localStorage not available
  }
}
