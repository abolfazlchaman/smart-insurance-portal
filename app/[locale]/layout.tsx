import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { vazirMatn } from 'next-persian-fonts/vazirmatn';
import { Inter } from 'next/font/google';
import { getTranslations } from 'next-intl/server';
import { getMessages, type Locale } from '@/app/lib/messages';
import '../globals.css';

const inter = Inter({ subsets: ['latin'] });

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

export async function generateMetadata() {
  const t = await getTranslations('Metadata');

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const direction = getDirection(locale);
  const messages = getMessages(locale as Locale);
  const metadata = await generateMetadata();

  // Determine which font to use based on locale
  const fontClassName = locale === 'fa' ? vazirMatn.className : inter.className;

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning>
      <head>
        <title>{metadata.title}</title>
        <meta
          name='description'
          content={metadata.description}
        />
      </head>
      <body className={`${fontClassName} antialiased`}>
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='light'>
          <NextIntlClientProvider
            locale={locale}
            messages={messages}>
            <div className='min-h-screen flex flex-col'>
              <Navbar />
              <main className='flex-grow'>{children}</main>
              <Footer />
            </div>
          </NextIntlClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
