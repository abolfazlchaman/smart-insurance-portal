import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({
  display: 'swap',
  variable: '--font-inter',
});

/**
 * Determines text direction based on locale
 * RTL languages include:
 * - Persian (fa)
 * - Arabic (ar) - for future use
 * - Hebrew (he) - for future use
 */
const getDirection = (locale: string) => {
  const rtlLocales = ['fa', 'ar', 'he'];
  return rtlLocales.includes(locale) ? 'rtl' : 'ltr';
};

export const metadata: Metadata = {
  title: 'Smart Insurance Portal',
  description: 'Your trusted insurance partner',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const direction = getDirection(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      className={inter.variable}>
      <body className='antialiased min-h-screen font-sans'>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
