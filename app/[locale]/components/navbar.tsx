'use client';

import { useTranslations } from 'next-intl';
import { usePathname } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useTheme } from 'next-themes';
import { useState, useEffect } from 'react';

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'fa', name: 'فارسی', flag: '🇮🇷' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
] as const;

const navigationItems = [
  { href: '/', label: 'home' },
  { href: '/', label: 'about' },
  { href: '/', label: 'services' },
  { href: '/', label: 'contact' },
  { href: '/', label: 'faq' },
] as const;

export function Navbar() {
  const t = useTranslations('Navigation');
  const pathname = usePathname();
  const currentLocale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Remove the current locale from the pathname
  const pathnameWithoutLocale = pathname.replace(`/${currentLocale}`, '') || '/';

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    document.body.style.overflow = !isMenuOpen ? 'hidden' : 'auto';
  };

  // Show skeleton buttons until mounted
  if (!mounted) {
    return (
      <div className='navbar bg-base-100 max-w-full'>
        <div className='navbar-start max-lg:w-full justify-between'>
          <div className='btn btn-ghost lg:hidden'>
            <div className='skeleton h-5 w-5'></div>
          </div>
          <div className='btn btn-ghost text-xl italic font-bold whitespace-nowrap'>
            <div className='skeleton h-6 w-32'></div>
          </div>
        </div>
        <div className='navbar-end gap-2 hidden lg:flex'>
          <div className='btn btn-ghost btn-circle'>
            <div className='skeleton h-5 w-5 rounded-full'></div>
          </div>
          <div className='btn btn-ghost whitespace-nowrap gap-2'>
            <div className='skeleton h-5 w-5 rounded-full'></div>
            <div className='skeleton h-4 w-16'></div>
          </div>
        </div>
      </div>
    );
  }

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
      {mounted && isMenuOpen && (
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
                  key={item.label}
                  href={item.href}
                  className='text-2xl font-semibold hover:text-primary transition-colors'
                  onClick={toggleMenu}>
                  {t(item.label)}
                </Link>
              ))}
            </nav>

            {/* Theme and Language switchers */}
            <div className='p-8 flex flex-col items-center space-y-4'>
              <div className='dropdown dropdown-top'>
                <div
                  tabIndex={0}
                  role='button'
                  className='btn btn-ghost btn-circle'>
                  {resolvedTheme === 'light' ? (
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
                        r='4'
                      />
                      <path d='M12 2v2' />
                      <path d='M12 20v2' />
                      <path d='m4.93 4.93 1.41 1.41' />
                      <path d='m17.66 17.66 1.41 1.41' />
                      <path d='M2 12h2' />
                      <path d='M20 12h2' />
                      <path d='m6.34 17.66-1.41 1.41' />
                      <path d='m19.07 4.93-1.41 1.41' />
                    </svg>
                  ) : (
                    <svg
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5'
                      viewBox='0 0 24 24'
                      fill='none'
                      stroke='currentColor'
                      strokeWidth='2'
                      strokeLinecap='round'
                      strokeLinejoin='round'>
                      <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                    </svg>
                  )}
                </div>
                <ul
                  tabIndex={0}
                  className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
                  <li>
                    <button
                      onClick={() => setTheme('light')}
                      className='flex items-center gap-2'>
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
                          r='4'
                        />
                        <path d='M12 2v2' />
                        <path d='M12 20v2' />
                        <path d='m4.93 4.93 1.41 1.41' />
                        <path d='m17.66 17.66 1.41 1.41' />
                        <path d='M2 12h2' />
                        <path d='M20 12h2' />
                        <path d='m6.34 17.66-1.41 1.41' />
                        <path d='m19.07 4.93-1.41 1.41' />
                      </svg>
                      Light
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setTheme('dark')}
                      className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                      </svg>
                      Dark
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setTheme('system')}
                      className='flex items-center gap-2'>
                      <svg
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5'
                        viewBox='0 0 24 24'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth='2'
                        strokeLinecap='round'
                        strokeLinejoin='round'>
                        <rect
                          width='20'
                          height='14'
                          x='2'
                          y='3'
                          rx='2'
                        />
                        <line
                          x1='8'
                          x2='16'
                          y1='21'
                          y2='21'
                        />
                        <line
                          x1='12'
                          x2='12'
                          y1='17'
                          y2='21'
                        />
                      </svg>
                      System
                    </button>
                  </li>
                </ul>
              </div>
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
      )}

      {/* Desktop navigation */}
      <div className='navbar-center hidden lg:flex'>
        <ul className='menu menu-horizontal px-1'>
          {navigationItems.map((item) => (
            <li key={item.label}>
              <Link href={item.href}>{t(item.label)}</Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Desktop theme and language switchers */}
      <div className='navbar-end gap-2 hidden lg:flex'>
        <div className='dropdown dropdown-end'>
          <div
            tabIndex={0}
            role='button'
            className='btn btn-ghost btn-circle'>
            {resolvedTheme === 'light' ? (
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
                  r='4'
                />
                <path d='M12 2v2' />
                <path d='M12 20v2' />
                <path d='m4.93 4.93 1.41 1.41' />
                <path d='m17.66 17.66 1.41 1.41' />
                <path d='M2 12h2' />
                <path d='M20 12h2' />
                <path d='m6.34 17.66-1.41 1.41' />
                <path d='m19.07 4.93-1.41 1.41' />
              </svg>
            ) : (
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-5 w-5'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth='2'
                strokeLinecap='round'
                strokeLinejoin='round'>
                <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
              </svg>
            )}
          </div>
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
            <li>
              <button
                onClick={() => setTheme('light')}
                className='flex items-center gap-2'>
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
                    r='4'
                  />
                  <path d='M12 2v2' />
                  <path d='M12 20v2' />
                  <path d='m4.93 4.93 1.41 1.41' />
                  <path d='m17.66 17.66 1.41 1.41' />
                  <path d='M2 12h2' />
                  <path d='M20 12h2' />
                  <path d='m6.34 17.66-1.41 1.41' />
                  <path d='m19.07 4.93-1.41 1.41' />
                </svg>
                Light
              </button>
            </li>
            <li>
              <button
                onClick={() => setTheme('dark')}
                className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <path d='M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z' />
                </svg>
                Dark
              </button>
            </li>
            <li>
              <button
                onClick={() => setTheme('system')}
                className='flex items-center gap-2'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-5 w-5'
                  viewBox='0 0 24 24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth='2'
                  strokeLinecap='round'
                  strokeLinejoin='round'>
                  <rect
                    width='20'
                    height='14'
                    x='2'
                    y='3'
                    rx='2'
                  />
                  <line
                    x1='8'
                    x2='16'
                    y1='21'
                    y2='21'
                  />
                  <line
                    x1='12'
                    x2='12'
                    y1='17'
                    y2='21'
                  />
                </svg>
                System
              </button>
            </li>
          </ul>
        </div>
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
