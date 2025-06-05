'use client';

import { useState, useEffect } from 'react';
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
  const [formData, setFormData] = useState<Record<string, any>>({});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        formId: form.formId,
        ...formData,
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

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [fieldId]: value,
    }));
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.visibility) return true;
    const { dependsOn, condition, value } = field.visibility;
    const dependentValue = formData[dependsOn];
    return condition === 'equals' ? dependentValue === value : true;
  };

  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    switch (field.type) {
      case 'text':
        return (
          <input
            type='text'
            name={field.id}
            required={field.required}
            className='input input-bordered w-full'
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type='number'
            name={field.id}
            required={field.required}
            className='input input-bordered w-full'
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'date':
        return (
          <input
            type='date'
            name={field.id}
            required={field.required}
            className='input input-bordered w-full'
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'select':
        if (!field.options) {
          console.warn(`No options provided for select field: ${field.id}`);
          return null;
        }

        return (
          <select
            name={field.id}
            required={field.required}
            className='select select-bordered w-full'
            onChange={(e) => handleInputChange(field.id, e.target.value)}>
            <option value=''>{t('selectPlaceholder')}</option>
            {field.options.map((option, index) => (
              <option
                key={`${field.id}-${option}-${index}`}
                value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        if (!field.options) {
          console.warn(`No options provided for radio field: ${field.id}`);
          return null;
        }

        return (
          <div className='flex flex-col gap-2'>
            {field.options.map((option, index) => (
              <label
                key={`${field.id}-${option}-${index}`}
                className='label cursor-pointer'>
                <span className='label-text text-wrap'>{option}</span>
                <input
                  type='radio'
                  name={field.id}
                  value={option}
                  required={field.required}
                  className='radio'
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
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

        return (
          <div className='flex flex-col gap-2'>
            {field.options.map((option, index) => (
              <label
                key={`${field.id}-${option}-${index}`}
                className='label cursor-pointer'>
                <span className='label-text text-wrap'>{option}</span>
                <input
                  type='checkbox'
                  name={`${field.id}[]`}
                  value={option}
                  required={field.required}
                  className='checkbox'
                  onChange={(e) => {
                    const currentValues = formData[field.id] || [];
                    const newValues = e.target.checked
                      ? [...currentValues, option]
                      : currentValues.filter((v: string) => v !== option);
                    handleInputChange(field.id, newValues);
                  }}
                />
              </label>
            ))}
          </div>
        );
      case 'group':
        if (!field.fields) {
          console.warn(`No nested fields provided for group field: ${field.id}`);
          return null;
        }

        return (
          <div className='space-y-4'>
            {field.fields.map((nestedField) => (
              <div
                key={nestedField.id}
                className='form-control'>
                <label className='label'>
                  <span className='label-text text-wrap'>{nestedField.label}</span>
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

      {form.fields.map((field) => (
        <div
          key={field.id}
          className='form-control'>
          <label className='label'>
            <span className='label-text text-wrap'>{field.label}</span>
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
