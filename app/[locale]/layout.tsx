import { NextIntlClientProvider, hasLocale } from 'next-intl';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

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
      dir={direction}>
      <body className='antialiased min-h-screen'>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
