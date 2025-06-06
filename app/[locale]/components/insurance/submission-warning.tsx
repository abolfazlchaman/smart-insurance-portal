'use client';

import { useTranslations } from 'next-intl';

export function SubmissionWarning() {
  const t = useTranslations('SubmissionsList');

  return (
    <div
      className='tooltip tooltip-left'
      data-tip={t('warningTooltip')}>
      <button
        className='btn btn-circle btn-ghost btn-xs'
        onClick={() => {
          const dialog = document.getElementById('warning-dialog') as HTMLDialogElement;
          dialog?.showModal();
        }}>
        ⚠️
      </button>

      <dialog
        id='warning-dialog'
        className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('warningTitle')}</h3>
          <p className='py-4'>{t('warningMessage')}</p>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn'>{t('close')}</button>
            </form>
          </div>
        </div>
        <form
          method='dialog'
          className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
