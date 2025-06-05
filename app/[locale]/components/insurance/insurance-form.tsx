'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { InsuranceForm as InsuranceFormType, FormField } from '@/app/types/insurance';
import { submitInsuranceForm } from '@/app/lib/api';

interface InsuranceFormProps {
  form: InsuranceFormType;
}

export function InsuranceForm({ form }: InsuranceFormProps) {
  const t = useTranslations('InsuranceForm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(event.currentTarget);
      const data = {
        formId: form.id,
        ...Object.fromEntries(formData.entries()),
      };
      await submitInsuranceForm(data);
      // Handle success (e.g., show success message, redirect)
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err instanceof Error ? err.message : t('error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field: FormField) => {
    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <input
            type={field.type}
            name={field.id}
            required={field.required}
            className='input input-bordered w-full'
            placeholder={field.placeholder}
          />
        );
      case 'select':
        if (!field.options) {
          console.warn(`No options provided for select field: ${field.id}`);
          return null;
        }
        // Convert string options to value/label objects
        const selectOptions = field.options.map((opt) =>
          typeof opt === 'string' ? { value: opt, label: opt } : opt,
        );

        return (
          <select
            name={field.id}
            required={field.required}
            className='select select-bordered w-full'>
            <option value=''>{t('selectPlaceholder')}</option>
            {selectOptions.map((option, index) => {
              return (
                <option
                  key={`${field.id}-${option.value}-${index}`}
                  value={option.value}>
                  {option.label}
                </option>
              );
            })}
          </select>
        );
      case 'radio':
        if (!field.options) {
          console.warn(`No options provided for radio field: ${field.id}`);
          return null;
        }
        // Convert string options to value/label objects
        const radioOptions = field.options.map((opt) =>
          typeof opt === 'string' ? { value: opt, label: opt } : opt,
        );
        return (
          <div className='flex flex-col gap-2'>
            {radioOptions.map((option, index) => (
              <label
                key={`${field.id}-${option.value}-${index}`}
                className='label cursor-pointer'>
                <span className='label-text'>{option.label}</span>
                <input
                  type='radio'
                  name={field.id}
                  value={option.value}
                  required={field.required}
                  className='radio'
                />
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        if (!field.options) {
          console.warn(`No options provided for checkbox field: ${field.id}`);
          return null;
        }
        // Convert string options to value/label objects
        const checkboxOptions = field.options.map((opt) =>
          typeof opt === 'string' ? { value: opt, label: opt } : opt,
        );
        return (
          <div className='flex flex-col gap-2'>
            {checkboxOptions.map((option, index) => (
              <label
                key={`${field.id}-${option.value}-${index}`}
                className='label cursor-pointer'>
                <span className='label-text'>{option.label}</span>
                <input
                  type='checkbox'
                  name={`${field.id}[]`}
                  value={option.value}
                  required={field.required}
                  className='checkbox'
                />
              </label>
            ))}
          </div>
        );
      case 'group':
        if (!field.nestedFields) {
          console.warn(`No nested fields provided for group field: ${field.id}`);
          return null;
        }
        return (
          <div className='space-y-4'>
            {field.nestedFields.map((nestedField) => (
              <div
                key={nestedField.id}
                className='form-control'>
                <label className='label'>
                  <span className='label-text'>{nestedField.label}</span>
                  {nestedField.required && <span className='text-error'>*</span>}
                </label>
                {renderField(nestedField)}
              </div>
            ))}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='space-y-6'>
      <h2 className='text-2xl font-bold'>{form.title}</h2>
      <p className='text-gray-600'>{form.description}</p>

      {form.fields.map((field) => (
        <div
          key={field.id}
          className='form-control'>
          <label className='label'>
            <span className='label-text'>{field.label}</span>
            {field.required && <span className='text-error'>*</span>}
          </label>
          {renderField(field)}
        </div>
      ))}

      {error && (
        <div className='alert alert-error'>
          <span>{error}</span>
        </div>
      )}

      <button
        type='submit'
        className='btn btn-primary w-full'
        disabled={isSubmitting}>
        {isSubmitting ? t('submitting') : t('submit')}
      </button>
    </form>
  );
}
