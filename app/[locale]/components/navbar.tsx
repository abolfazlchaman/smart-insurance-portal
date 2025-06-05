'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeSwitcher } from './theme-switcher';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

export function Navbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const currentLocale = useLocale();

  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  return (
    <div className='navbar bg-base-100 max-w-full'>
      <div className='navbar-start'>
        <div className='dropdown'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost lg:hidden'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'>
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2'
                d='M4 6h16M4 12h8m-8 6h16'
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className='menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <Link href='/'>{t('home')}</Link>
            </li>
            <li>
              <Link href='/about'>{t('about')}</Link>
            </li>
          </ul>
        </div>
        <Link
          href='/'
          className='btn btn-ghost text-xl italic font-bold whitespace-nowrap'>
          Insurance Portal
        </Link>
      </div>
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          <li>
            <Link href='/'>{t('home')}</Link>
          </li>
          <li>
            <Link href='/about'>{t('about')}</Link>
          </li>
        </ul>
      </div>
      <div className='navbar-end gap-2'>
        <ThemeSwitcher />
        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost whitespace-nowrap gap-2'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='h-5 w-5'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'>
              <circle
                cx='12'
                cy='12'
                r='10'
              />
              <path d='M2 12h20' />
              <path d='M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' />
            </svg>
            {languages.find((lang) => lang.code === currentLocale)?.name || 'Language'}
          </div>
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
            {languages.map((lang) => (
              <li key={lang.code}>
                <Link
                  href={pathnameWithoutLocale}
                  locale={lang.code}
                  className='w-full text-left flex items-center gap-2'>
                  <span className='text-lg'>{lang.flag}</span>
                  {lang.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
