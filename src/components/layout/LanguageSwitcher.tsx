'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useI18n } from '@/context/I18nContext';

export function LanguageSwitcher() {
  const { locale, toggleLocale, isRTL } = useI18n();

  return (
    <button
      onClick={toggleLocale}
      className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 bg-zinc-900/50 hover:bg-zinc-800/80 transition-all duration-200 text-sm text-zinc-400 hover:text-white group"
      aria-label={`Switch to ${locale === 'ar' ? 'English' : 'العربية'}`}
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      <span className="text-xs font-medium">{locale === 'ar' ? 'EN' : 'ع'}</span>
      <span className="w-px h-3 bg-zinc-700" />
      <motion.span
        key={locale}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-xs"
      >
        {locale === 'ar' ? 'English' : 'العربية'}
      </motion.span>
    </button>
  );
}
