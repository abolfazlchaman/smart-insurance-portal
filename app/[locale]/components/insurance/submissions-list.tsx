'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { InsuranceSubmission, ListViewConfig, TransformedSubmission } from '@/app/types/insurance';
import { fetchSubmissions } from '@/app/lib/api';
import { SubmissionsSkeleton } from './submissions-skeleton';
import { SubmissionWarning } from './submission-warning';
import {
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  ArrowUpDown,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Info,
  X,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'insurance_submissions';
const DEFAULT_PAGE_SIZE = 5;

export function SubmissionsList() {
  const t = useTranslations('SubmissionsList');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<TransformedSubmission[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selectedColumns, setSelectedColumns] = useState<string[]>([]);
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [config, setConfig] = useState<ListViewConfig>({
    columns: [],
    page: 1,
    pageSize: DEFAULT_PAGE_SIZE,
  });

  useEffect(() => {
    loadSubmissions();

    // Add event listener for refresh
    const handleRefresh = () => {
      loadSubmissions();
    };

    const element = document.querySelector('[data-testid="submissions-list"]');
    element?.addEventListener('refresh-submissions', handleRefresh);

    return () => {
      element?.removeEventListener('refresh-submissions', handleRefresh);
    };
  }, [config]);

  const loadSubmissions = async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Get server data
      const serverResponse = await fetchSubmissions(config);
      setColumns(serverResponse.columns);

      // Get local data
      const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
      const localSubmissions = localData ? JSON.parse(localData) : [];

      // Merge server and local data
      const mergedData = [...serverResponse.data, ...localSubmissions];

      setSubmissions(mergedData);
      if (selectedColumns.length === 0) {
        setSelectedColumns(serverResponse.columns);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t('error'));
      showSuccessAlert(t('error'), 'error');
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

  const getSortedSubmissions = (submissions: TransformedSubmission[]) => {
    if (!config.sortBy) return submissions;

    return [...submissions].sort((a, b) => {
      const aValue = a.data[config.sortBy as keyof typeof a.data] ?? '';
      const bValue = b.data[config.sortBy as keyof typeof b.data] ?? '';

      // Handle numeric values
      if (!isNaN(Number(aValue)) && !isNaN(Number(bValue))) {
        return config.sortDirection === 'asc'
          ? Number(aValue) - Number(bValue)
          : Number(bValue) - Number(aValue);
      }

      // Handle date values
      const aDate = new Date(aValue);
      const bDate = new Date(bValue);
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return config.sortDirection === 'asc'
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime();
      }

      // Handle string values
      return config.sortDirection === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  };

  const handleColumnToggle = (column: string) => {
    setSelectedColumns((prev) =>
      prev.includes(column) ? prev.filter((col) => col !== column) : [...prev, column],
    );
  };

  const handlePageChange = (newPage: number) => {
    setConfig((prev) => ({ ...prev, page: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setConfig((prev) => ({ ...prev, pageSize: newSize, page: 1 }));
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setConfig({
      columns: [],
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
    });
    setSelectedColumns(columns);
    setSelectedRows(new Set());
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const showSuccessAlert = (message: string, type: 'success' | 'error' = 'success') => {
    setAlertMessage(message);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleDelete = (id: string) => {
    const dialog = document.getElementById('delete-dialog') as HTMLDialogElement;
    if (dialog) {
      dialog.showModal();
      dialog.addEventListener('close', () => {
        if (dialog.returnValue === 'confirm') {
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            const submissions = JSON.parse(localData);
            const updatedSubmissions = submissions.filter((sub: any) => sub.id !== id);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedSubmissions));
            loadSubmissions();
            showSuccessAlert(t('deleteSuccess'));
          }
        }
      });
    }
  };

  const handleEdit = (id: string) => {
    showSuccessAlert(t('editSuccess'));
  };

  const highlightText = (text: string) => {
    if (!searchQuery) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark
          key={i}
          className='bg-warning/20'>
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const isLocalSubmission = (id: string) => {
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localData) return false;
    const localSubmissions = JSON.parse(localData);
    return localSubmissions.some((sub: any) => sub.id === id);
  };

  const filteredSubmissions = submissions.filter((submission) => {
    if (!searchQuery) return true;
    return Object.values(submission.data).some((value) =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase()),
    );
  });

  const sortedSubmissions = getSortedSubmissions(filteredSubmissions);

  const paginatedSubmissions = sortedSubmissions.slice(
    (config.page - 1) * config.pageSize,
    config.page * config.pageSize,
  );

  const getSortIcon = (column: string) => {
    if (config.sortBy !== column) {
      return <ArrowUpDown className='h-4 w-4 opacity-50' />;
    }
    return config.sortDirection === 'asc' ? (
      <ArrowUpDown className='h-4 w-4' />
    ) : (
      <ArrowUpDown className='h-4 w-4 rotate-180' />
    );
  };

  if (isLoading) {
    return <SubmissionsSkeleton />;
  }

  if (error) {
    return (
      <div className='alert alert-error'>
        <AlertTriangle className='h-6 w-6' />
        <span>{error}</span>
      </div>
    );
  }

  return (
    <div
      className='space-y-4'
      data-testid='submissions-list'>
      {/* Success Alert */}
      {showAlert && (
        <div
          className={`alert ${
            alertMessage.includes('error') ? 'alert-error' : 'alert-success'
          } fixed top-4 right-4 z-50 shadow-lg`}>
          {alertMessage.includes('error') ? (
            <AlertTriangle className='h-6 w-6' />
          ) : (
            <Check className='h-6 w-6' />
          )}
          <span>{alertMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <dialog
        id='delete-dialog'
        className='modal'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>{t('confirmDeleteTitle')}</h3>
          <p className='py-4'>{t('confirmDelete')}</p>
          <div className='modal-action'>
            <form method='dialog'>
              <button className='btn btn-ghost'>{t('cancel')}</button>
              <button
                className='btn btn-error ml-2'
                value='confirm'>
                {t('delete')}
              </button>
            </form>
          </div>
        </div>
        <form
          method='dialog'
          className='modal-backdrop'>
          <button>close</button>
        </form>
      </dialog>

      {/* Local Storage Warning Dialog */}
      <dialog
        id='local-storage-warning'
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

      <div className='flex justify-between items-center flex-wrap max-sm:justify-center gap-4'>
        <div className='flex items-center gap-2'>
          <h2 className='text-2xl font-bold'>{t('title')}</h2>
          <SubmissionWarning />
        </div>
        <div className='flex items-center gap-2'>
          <div className='join'>
            <div className='join-item'>
              <input
                type='text'
                placeholder={t('search')}
                className='input input-bordered join-item'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className='btn join-item'>
              <Search className='h-4 w-4' />
            </button>
          </div>
          {(searchQuery || config.sortBy || selectedColumns.length !== columns.length) && (
            <button
              className='btn btn-outline gap-2'
              onClick={handleClearFilters}>
              <X className='h-4 w-4' />
              {t('clearFilters')}
            </button>
          )}
          <div className='dropdown dropdown-end'>
            <label
              tabIndex={0}
              className='btn btn-outline'>
              <Filter className='h-4 w-4' />
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
      </div>

      <div className='overflow-x-auto'>
        <table className='table'>
          <thead>
            <tr>
              <th>
                <input
                  type='checkbox'
                  className='checkbox'
                  checked={selectedRows.size === paginatedSubmissions.length}
                  onChange={() => {
                    if (selectedRows.size === paginatedSubmissions.length) {
                      setSelectedRows(new Set());
                    } else {
                      setSelectedRows(new Set(paginatedSubmissions.map((s) => s.id)));
                    }
                  }}
                />
              </th>
              <th>#</th>
              {selectedColumns.map((column) => (
                <th
                  key={column}
                  className='cursor-pointer hover:bg-base-200'
                  onClick={() => handleSort(column)}>
                  <div className='flex items-center gap-2'>
                    {column}
                    {getSortIcon(column)}
                  </div>
                </th>
              ))}
              <th>{t('actions')}</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubmissions.map((submission, index) => (
              <tr
                key={submission.id}
                className={selectedRows.has(submission.id) ? 'bg-base-200' : ''}>
                <td>
                  <input
                    type='checkbox'
                    className='checkbox'
                    checked={selectedRows.has(submission.id)}
                    onChange={() => handleRowSelect(submission.id)}
                  />
                </td>
                <td>
                  <div className='flex items-center gap-2'>
                    {(config.page - 1) * config.pageSize + index + 1}
                    {isLocalSubmission(submission.id) && (
                      <button
                        className='btn btn-ghost btn-xs'
                        onClick={() => {
                          const dialog = document.getElementById(
                            'local-storage-warning',
                          ) as HTMLDialogElement;
                          dialog?.showModal();
                        }}>
                        <Info className='h-4 w-4 text-info' />
                      </button>
                    )}
                  </div>
                </td>
                {selectedColumns.map((column) => {
                  const value = submission.data[column];
                  const displayValue = value != null ? String(value) : '-';

                  return <td key={`${submission.id}-${column}`}>{highlightText(displayValue)}</td>;
                })}
                <td>
                  <div className='flex gap-2'>
                    <button
                      className='btn btn-ghost btn-sm'
                      onClick={() => handleEdit(submission.id)}>
                      <Edit2 className='h-4 w-4' />
                    </button>
                    <button
                      className='btn btn-ghost btn-sm text-error'
                      onClick={() => handleDelete(submission.id)}>
                      <Trash2 className='h-4 w-4' />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className='flex justify-between items-center flex-wrap gap-2 max-md:justify-center'>
        <div className='flex items-center gap-2'>
          <span>{t('show')}</span>
          <select
            className='select select-bordered select-sm'
            value={config.pageSize}
            onChange={(e) => handlePageSizeChange(Number(e.target.value))}>
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
          <span>{t('entries')}</span>
        </div>
        <div className='join'>
          <button
            className='join-item btn btn-sm'
            onClick={() => handlePageChange(config.page - 1)}
            disabled={config.page === 1}>
            <ChevronLeft className='h-4 w-4' />
          </button>
          <button className='join-item btn btn-sm'>{t('page', { page: config.page })}</button>
          <button
            className='join-item btn btn-sm'
            onClick={() => handlePageChange(config.page + 1)}
            disabled={paginatedSubmissions.length < config.pageSize}>
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}
