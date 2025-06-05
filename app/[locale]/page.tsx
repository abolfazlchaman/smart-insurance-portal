import { Suspense } from 'react';
import { InsuranceForm } from './components/insurance/insurance-form';
import { SubmissionsList } from './components/insurance/submissions-list';
import { fetchInsuranceForms } from '@/app/lib/api';

export default async function Home() {
  const forms = await fetchInsuranceForms();

  return (
    <main className='container mx-auto px-4 py-8'>
      <div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
        <div>
          <h1 className='text-3xl font-bold mb-8'>Apply for Insurance</h1>
          <Suspense fallback={<div>Loading form...</div>}>
            {/* TODO remove id */}
            {forms.map((form, id) => (
              <div
                key={id}
                className='mb-8'>
                <InsuranceForm form={form} />
              </div>
            ))}
          </Suspense>
        </div>

        <div>
          <h1 className='text-3xl font-bold mb-8'>Your Applications</h1>
          <Suspense fallback={<div>Loading applications...</div>}>
            <SubmissionsList />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
