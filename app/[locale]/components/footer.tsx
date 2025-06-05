'use client';

import { useTranslations } from 'next-intl';

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className='footer footer-center p-4 bg-base-300 text-base-content max-w-full'>
      <div className='flex flex-col items-center'>
        <p className='italic font-bold text-xl mb-2 whitespace-nowrap'>Insurance Portal</p>
        <p className='text-center'>{t('copyright')}</p>
      </div>
    </footer>
  );
}
