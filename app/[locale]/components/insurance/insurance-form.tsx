'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  InsuranceForm as InsuranceFormType,
  FormField,
  InsuranceType,
} from '@/app/types/insurance';
import { submitInsuranceForm, fetchStates } from '@/app/lib/api';

interface InsuranceFormProps {
  forms: InsuranceFormType[];
}

export function InsuranceForm({ forms }: InsuranceFormProps) {
  const t = useTranslations('InsuranceForm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [stateOptions, setStateOptions] = useState<Record<string, string[]>>({});

  // Reset form data when insurance type changes
  useEffect(() => {
    setFormData({});
    setError(null);
  }, [selectedType]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const data = {
        formId: selectedForm?.formId,
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

  const handleInputChange = async (fieldId: string, value: any) => {
    setFormData((prev) => {
      const newData = {
        ...prev,
        [fieldId]: value,
      };

      // If this is a country field, fetch states
      if (fieldId === 'country') {
        fetchStatesForCountry(value);
      }

      return newData;
    });
  };

  const fetchStatesForCountry = async (country: string) => {
    try {
      const states = await fetchStates(country);
      setStateOptions((prev) => ({
        ...prev,
        [country]: states,
      }));
    } catch (err) {
      console.error('Error fetching states:', err);
      setError(err instanceof Error ? err.message : t('error'));
    }
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.visibility) return true;
    const { dependsOn, condition, value } = field.visibility;
    const dependentValue = formData[dependsOn];
    return condition === 'equals' ? dependentValue === value : true;
  };

  const selectedForm = forms.find((form) => {
    switch (selectedType) {
      case 'health':
        return form.formId === 'health_insurance_application';
      case 'home':
        return form.formId === 'home_insurance_application';
      case 'car':
        return form.formId === 'car_insurance_application';
      default:
        return false;
    }
  });

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
        if (field.dynamicOptions) {
          const options = stateOptions[formData[field.dynamicOptions.dependsOn]] || [];
          return (
            <select
              defaultValue=''
              name={field.id}
              required={field.required}
              className='select select-bordered w-full'
              onChange={(e) => handleInputChange(field.id, e.target.value)}>
              <option
                value=''
                disabled
                label={t('selectPlaceholder')}
              />
              {options.map((option) => (
                <option
                  key={option}
                  value={option}>
                  {option}
                </option>
              ))}
            </select>
          );
        }

        if (!field.options) {
          console.warn(`No options provided for select field: ${field.id}`);
          return null;
        }

        return (
          <select
            defaultValue=''
            name={field.id}
            required={field.required}
            className='select select-bordered w-full'
            onChange={(e) => handleInputChange(field.id, e.target.value)}>
            <option
              value=''
              disabled
              label={t('selectPlaceholder')}
            />
            {field.options.map((option) => (
              <option
                key={option}
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
          <div className='flex flex-row gap-2 flex-wrap max-w-full'>
            {field.options.map((option) => (
              <label
                key={option}
                className='label cursor-pointer'>
                <span className='label-text text-wrap my-2'>{option}</span>
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
          <div className='flex flex-row gap-2 flex-wrap max-w-full'>
            {field.options.map((option) => (
              <label
                key={option}
                className='label cursor-pointer'>
                <span className='label-text text-wrap my-2'>{option}</span>
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
                  <span className='label-text text-wrap my-2'>{nestedField.label}</span>
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
    <div className='space-y-6'>
      <div className='flex flex-row flex-wrap gap-4 justify-center items-center max-w-full'>
        <button
          type='button'
          className={`btn ${selectedType === 'health' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('health')}>
          Health Insurance
        </button>
        <button
          type='button'
          className={`btn ${selectedType === 'home' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('home')}>
          Home Insurance
        </button>
        <button
          type='button'
          className={`btn ${selectedType === 'car' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('car')}>
          Car Insurance
        </button>
      </div>

      {selectedForm ? (
        <form
          onSubmit={handleSubmit}
          className='space-y-6'>
          <h2 className='text-2xl font-bold'>{selectedForm.title}</h2>

          {selectedForm.fields.map((field) => (
            <div
              key={field.id}
              className='form-control'>
              <label className='label'>
                <span className='label-text text-wrap my-2'>{field.label}</span>
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
      ) : (
        <div className='text-center p-8 bg-base-200 rounded-lg'>
          <p className='text-lg'>{t('selectInsuranceType')}</p>
        </div>
      )}
    </div>
  );
}
