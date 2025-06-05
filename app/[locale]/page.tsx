import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <main className='min-h-screen flex flex-col justify-center items-center'>
      <h1>{t('title')}</h1>
      <Link href='/about'>{t('about')}</Link>
    </main>
  );
}
