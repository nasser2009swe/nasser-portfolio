'use client';

import React from 'react';
import Link from 'next/link';
import { FiMail } from 'react-icons/fi';
import { useI18n } from '@/context/I18nContext';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { t } = useI18n();

  return (
    <footer className="relative border-t border-zinc-800 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">ن</span>
              </div>
              <span className="text-white font-semibold">ناصر مندي حجاج</span>
            </Link>
            <p className="text-sm text-zinc-400 max-w-md leading-relaxed">
              {t('footer.description')}
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('footer.quickLinks')}
            </h3>
            <div className="flex flex-col space-y-2">
              <Link
                href="/"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {t('nav.home')}
              </Link>
              <Link
                href="/#projects"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {t('nav.projects')}
              </Link>
              <Link
                href="/#skills"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {t('nav.skills')}
              </Link>
              <Link
                href="/#contact"
                className="text-sm text-zinc-400 hover:text-white transition-colors"
              >
                {t('nav.contact')}
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              {t('footer.contact')}
            </h3>
            <div className="flex flex-col space-y-2">
              <a
                href="mailto:nasser2009swe@gmail.com"
                className="text-sm text-zinc-400 hover:text-white transition-colors flex items-center gap-2"
              >
                <FiMail size={14} />
                nasser2009swe@gmail.com
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-800">
          <p className="text-center text-sm text-zinc-500">
            &copy; {currentYear} ناصر مندي حجاج. {t('footer.copyright')}
          </p>
        </div>
      </div>
    </footer>
  );
}
