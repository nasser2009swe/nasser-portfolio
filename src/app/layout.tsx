import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Noto_Sans_Arabic } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/context/AuthContext';
import { I18nProvider } from '@/context/I18nContext';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
  weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: {
    default: 'ناصر مندي حجاج | مطور فلاتر وتطبيقات متكاملة',
    template: '%s | ناصر مندي حجاج',
  },
  description:
    'مطور فلاتر متخصص في أنظمة الفواتير، نقاط البيع، إنشاء PDF، وتكامل طابعات الحرارة. أبني تطبيقات أعمال متعددة المنصات تحقق نتائج مذهلة.',
  keywords: [
    'flutter developer',
    'full-stack developer',
    'mobile app developer',
    'invoice system',
    'pos billing',
    'pdf generator',
    'dart',
    'cross-platform',
    'portfolio',
    'مطور فلاتر',
    'تطبيقات الأعمال',
    'أنظمة الفواتير',
    'نقاط البيع',
    'تطوير تطبيقات',
  ],
  authors: [
    {
      name: 'ناصر مندي حجاج',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'ar_SA',
    siteName: 'ناصر مندي حجاج | Nasser Mondey Hagag',
    title: 'ناصر مندي حجاج | مطور فلاتر وتطبيقات متكاملة',
    description:
      'مطور فلاتر متخصص في أنظمة الفواتير، نقاط البيع، إنشاء PDF، وتكامل طابعات الحرارة.',
    alternateLocale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    'og:locale:alternate': 'en_US',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className="scroll-smooth"
      suppressHydrationWarning
    >
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${notoSansArabic.variable} font-sans antialiased bg-zinc-950 text-zinc-100`}
      >
        <I18nProvider>
          <AuthProvider>
            <Header />
            {children}
            <Footer />
          </AuthProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
