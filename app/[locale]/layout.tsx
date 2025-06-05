import { Navbar } from './components/navbar';
import { Footer } from './components/footer';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ThemeProvider } from 'next-themes';
import { vazirMatn } from 'next-persian-fonts/vazirmatn';
import '../globals.css';

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

async function getMessages(locale: string) {
  try {
    return (await import(`../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const direction = getDirection(locale);
  const messages = await getMessages(locale);

  return (
    <html
      lang={locale}
      dir={direction}
      suppressHydrationWarning>
      <body className={`${vazirMatn.className} antialiased`}>
        <ThemeProvider
          attribute='data-theme'
          defaultTheme='system'
          enableSystem
          disableTransitionOnChange>
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
