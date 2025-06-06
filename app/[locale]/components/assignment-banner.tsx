'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { X } from 'lucide-react';

const BANNER_STORAGE_KEY = 'assignment_banner_hidden';

export function AssignmentBanner() {
  const t = useTranslations('AssignmentBanner');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const isHidden = localStorage.getItem(BANNER_STORAGE_KEY);
    setIsVisible(!isHidden);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    localStorage.setItem(BANNER_STORAGE_KEY, 'true');
  };

  if (!isVisible) return null;

  return (
    <div className="alert alert-info shadow-lg fixed bottom-0 left-0 right-0 z-50">
      <div className="flex-1">
        <p>
          {t('message')}{' '}
          <a
            href="https://www.abolfazlchaman.com"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            {t('developer')}
          </a>
        </p>
      </div>
      <button className="btn btn-ghost btn-sm" onClick={handleClose}>
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
