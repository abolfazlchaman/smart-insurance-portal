'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { ThemeSwitcher } from './theme-switcher';
import { useState } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
] as const;

const navigationItems = [
  { href: '/', label: 'home' },
  { href: '/about', label: 'about' },
  { href: '/services', label: 'services' },
  { href: '/contact', label: 'contact' },
  { href: '/faq', label: 'faq' },
] as const;

export function Navbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  return (
    <div className='navbar bg-base-100 max-w-full'>
      <div className='navbar-start max-lg:w-full justify-between'>
        <button
          onClick={toggleMenu}
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
        </button>
        <Link
          href='/'
          className='btn btn-ghost text-xl italic font-bold whitespace-nowrap'>
          Insurance Portal
        </Link>
      </div>

      {/* Full-screen menu overlay */}
      <div
        className={`fixed inset-0 bg-base-100 z-50 transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
        <div className='flex flex-col h-full'>
          {/* Header with close button */}
          <div className='flex justify-between items-center p-4 border-b border-base-300'>
            <Link
              href='/'
              className='btn btn-ghost text-xl italic font-bold whitespace-nowrap'
              onClick={toggleMenu}>
              Insurance Portal
            </Link>
            <button
              onClick={toggleMenu}
              className='btn btn-ghost btn-circle'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-6 w-6'
                fill='none'
                viewBox='0 0 24 24'
                stroke='currentColor'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          {/* Navigation items */}
          <nav className='flex-1 flex flex-col items-center justify-center space-y-8'>
            {navigationItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className='text-2xl font-semibold hover:text-primary transition-colors'
                onClick={toggleMenu}>
                {t(item.label)}
              </Link>
            ))}
          </nav>

          {/* Theme and Language switchers */}
          <div className='p-8 flex flex-col items-center space-y-4'>
            <ThemeSwitcher />
            <div className='dropdown dropdown-top'>
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
                      className='w-full text-left flex items-center gap-2'
                      onClick={toggleMenu}>
                      <span className='text-lg'>{lang.flag}</span>
                      {lang.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop navigation */}
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          {navigationItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{t(item.label)}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop theme and language switchers */}
      <div className='navbar-end gap-2 hidden lg:flex'>
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
