import { Suspense } from 'react';
import { getTranslations } from 'next-intl/server';
import { InsuranceForm } from './components/insurance/insurance-form';
import { SubmissionsList } from './components/insurance/submissions-list';
import { FormSkeleton } from './components/insurance/form-skeleton';
import { SubmissionsSkeleton } from './components/insurance/submissions-skeleton';
import { fetchInsuranceForms } from '@/app/lib/api';

export default async function HomePage() {
  const t = await getTranslations('HomePage');
  const forms = await fetchInsuranceForms();

  return (
    <main className='container mx-auto px-4 py-8'>
      <h1 className='text-4xl font-bold text-center mb-8'>
        {t('applyInsurance')}
        <hr className='my-12 opacity-30' />
      </h1>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <Suspense fallback={<FormSkeleton />}>
            <InsuranceForm forms={forms} />
          </Suspense>
        </div>

        <div>
          {/* <h2 className='text-2xl font-semibold mb-4'>{t('yourApplications')}</h2> */}
          <Suspense fallback={<SubmissionsSkeleton />}>
            <SubmissionsList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
