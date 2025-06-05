'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { InsuranceSubmission, ListViewConfig } from '@/app/types/insurance';
import { fetchSubmissions } from '@/app/lib/api';
import { SubmissionsSkeleton } from './submissions-skeleton';

export function SubmissionsList() {
  const t = useTranslations('SubmissionsList');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<InsuranceSubmission[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [config, setConfig] = useState<ListViewConfig>({
    columns: [],
    page: 1,
    pageSize: 10,
  });

  useEffect(() => {
    loadSubmissions();
  }, [config]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetchSubmissions(config);
      setSubmissions(response.data);
      setColumns(response.columns);
      if (selectedColumns.length === 0) {
        setSelectedColumns(response.columns);
      }
    } catch (err) {
      console.error('Error loading submissions:', err);
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSort = (column: string) => {
    setConfig((prev) => ({
      ...prev,
      sortBy: column,
      sortDirection: prev.sortBy === column && prev.sortDirection === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column],
    );
  };

  const handlePageChange = (newPage: number) => {
    setConfig((prev) => ({ ...prev, page: newPage }));
  };

  if (isLoading) {
    return <SubmissionsSkeleton />;
  }

  if (error) {
    return (
      <div className='alert alert-error'>
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      <div className='flex justify-between items-center'>
        <h2 className='text-2xl font-bold'>{t('title')}</h2>
        <div className='dropdown dropdown-end'>
          <label
            tabIndex={0}
            className='btn btn-outline'>
            {t('columns')}
          </label>
          <ul
            tabIndex={0}
            className='dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52'>
            {columns.map((column) => (
              <li key={column}>
                <label className='label cursor-pointer'>
                  <span className='label-text text-wrap my-2'>{column}</span>
                  <input
                    type='checkbox'
                    className='checkbox'
                    checked={selectedColumns.includes(column)}
                    onChange={() => handleColumnToggle(column)}
                  />
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              {selectedColumns.map((column) => (
                <th
                  key={column}
                  className='cursor-pointer hover:bg-base-200'
                  onClick={() => handleSort(column)}>
                  <div className='flex items-center gap-2'>
                    {column}
                    {config.sortBy === column && (
                      <span>{config.sortDirection === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {submissions.map((submission) => (
              <tr key={submission.id}>
                {selectedColumns.map((column) => {
                  const value = submission[column as keyof typeof submission];
                  return (
                    <td key={`${submission.id}-${column}`}>
                      {value != null ? String(value) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-center gap-2'>
        <button
          className='btn btn-sm btn-outline'
          onClick={() => handlePageChange(config.page - 1)}
          disabled={config.page === 1}>
          {t('previous')}
        </button>
        <span className='flex items-center'>{t('page', { page: config.page })}</span>
        <button
          className='btn btn-sm btn-outline'
          onClick={() => handlePageChange(config.page + 1)}
          disabled={submissions.length < config.pageSize}>
          {t('next')}
        </button>
      </div>
    </div>
  );
}
