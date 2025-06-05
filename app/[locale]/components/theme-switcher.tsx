'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Show a skeleton button until mounted
  if (!mounted) {
    return (
      <div className='btn btn-ghost btn-circle'>
        <div className='skeleton h-5 w-5 rounded-full'></div>
      </div>
    );
  }

  return (
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
        ) : resolvedTheme === 'dark' ? (
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
  );
}
