'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
  InsuranceForm as InsuranceFormType,
  FormField,
  InsuranceType,
} from '@/app/types/insurance';
import { submitInsuranceForm, fetchStates } from '@/app/lib/api';
import {
  Heart,
  Home,
  Car,
  HelpCircle,
  Info,
  AlertTriangle,
  Check,
} from 'lucide-react';

interface InsuranceFormProps {
  forms: InsuranceFormType[];
}

export function InsuranceForm({ forms }: InsuranceFormProps) {
  const t = useTranslations('InsuranceForm');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [selectedType, setSelectedType] = useState<InsuranceType | null>(null);
  const [stateOptions, setStateOptions] = useState<Record<string, string[]>>(
    {},
  );
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error' | 'warning'>(
    'success',
  );

  // Add validation state
  const [isFormValid, setIsFormValid] = useState(false);

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

  // Reset form data when insurance type changes
  useEffect(() => {
    setFormData({});
    setError(null);
    setIsFormValid(false);
  }, [selectedType]);

  // Validate form whenever formData or selectedForm changes
  useEffect(() => {
    if (!selectedForm) {
      setIsFormValid(false);
      return;
    }

    const validateForm = () => {
      if (!selectedForm) return false;

      // Check required fields
      const requiredFields = selectedForm.fields.filter(
        (field) =>
          field.required &&
          isFieldVisible(field) &&
          field.id !== 'has_safety_measures' &&
          field.id !== 'gender' &&
          // Exclude health_info group from direct validation since it contains nested fields
          field.id !== 'health_info',
      );

      const hasRequiredFields = requiredFields.every((field) => {
        const value = formData[field.id];

        if (field.type === 'checkbox') {
          return Array.isArray(value) && value.length > 0;
        }

        if (field.type === 'group') {
          return field.fields?.every((nestedField) => {
            if (!nestedField.required || !isFieldVisible(nestedField))
              return true;
            return (
              formData[nestedField.id] != null &&
              formData[nestedField.id] !== ''
            );
          });
        }

        return value != null && value !== '';
      });

      // Special validation for home insurance safety measures
      if (selectedType === 'home' && formData.has_safety_measures === 'yes') {
        const safetyMeasures = [
          'smoke_detectors',
          'fire_extinguishers',
          'sprinkler_system',
        ];
        const hasAtLeastOneMeasure = safetyMeasures.some(
          (measure) => formData[measure] === true,
        );
        if (!hasAtLeastOneMeasure) return false;
      }

      // Special validation for health insurance
      if (selectedType === 'health') {
        // Check if all required health info fields are filled
        const healthInfoFields =
          selectedForm.fields.find((f) => f.id === 'health_info')?.fields || [];
        const hasAllHealthInfo = healthInfoFields.every((field) => {
          if (!field.required || !isFieldVisible(field)) return true;
          return formData[field.id] != null && formData[field.id] !== '';
        });
        if (!hasAllHealthInfo) return false;
      }

      return hasRequiredFields;
    };

    setIsFormValid(validateForm());
  }, [formData, selectedForm]);

  const calculateAge = (dob: string): number => {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const showAlertMessage = (
    message: string,
    type: 'success' | 'error' | 'warning' = 'success',
  ) => {
    setAlertMessage(message);
    setAlertType(type);
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSubmitting(true);
    setError(null);

    try {
      // Calculate age from date of birth
      const age = formData.dob ? calculateAge(formData.dob) : 0;

      // Format the data according to API requirements
      const data = {
        id: Date.now().toString(), // Generate a temporary ID
        'Full Name':
          `${formData.first_name || ''} ${formData.last_name || ''}`.trim() ||
          'N/A',
        Age: age,
        'Insurance Type': selectedType
          ? selectedType.charAt(0).toUpperCase() + selectedType.slice(1)
          : 'N/A',
        City: formData.city || 'N/A',
        Country: formData.country || 'N/A',
        State: formData.state || 'N/A',
        'Date of Birth': formData.dob || 'N/A',
        Smoker: formData.smoker || 'N/A',
        'Smoking Frequency': formData.smoking_frequency || 'N/A',
        Gender: 'N/A', // Add default gender value
      };

      // Submit to API (even though it's not persisting)
      await submitInsuranceForm(data);

      // Store in local storage
      const localData = localStorage.getItem('insurance_submissions');
      const submissions = localData ? JSON.parse(localData) : [];
      submissions.push({
        id: data.id,
        formId:
          data['Insurance Type'].toLowerCase().replace(' ', '_') +
          '_application',
        data,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      localStorage.setItem(
        'insurance_submissions',
        JSON.stringify(submissions),
      );

      // Reset form after successful submission
      setFormData({});
      setSelectedType(null);
      setIsFormValid(false);

      // Show success message
      showAlertMessage(t('success'));

      // Dispatch custom event to refresh submissions list
      const event = new CustomEvent('refresh-submissions', {
        detail: {
          newSubmission: {
            id: data.id,
            formId:
              data['Insurance Type'].toLowerCase().replace(' ', '_') +
              '_application',
            data,
            status: 'pending',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        },
      });
      document.dispatchEvent(event);
    } catch (err) {
      showAlertMessage(
        err instanceof Error ? err.message : t('error'),
        'error',
      );
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
      showAlertMessage(
        err instanceof Error ? err.message : t('error'),
        'error',
      );
    }
  };

  const isFieldVisible = (field: FormField): boolean => {
    if (!field.visibility) return true;
    const { dependsOn, condition, value } = field.visibility;
    const dependentValue = formData[dependsOn];
    return condition === 'equals' ? dependentValue === value : true;
  };

  const renderField = (field: FormField) => {
    if (!isFieldVisible(field)) return null;

    // Add notice for health insurance (no gender field)
    if (selectedType === 'health' && field.id === 'health_info') {
      return (
        <div className="space-y-4">
          <div className="alert alert-warning">
            <Info className="h-4 w-4" />
            <span>{t('genderNote')}</span>
          </div>
          {field.fields?.map((nestedField) => {
            if (!isFieldVisible(nestedField)) return null;
            return (
              <div key={nestedField.id} className="form-control">
                <label className="label">
                  <span className="label-text text-wrap my-2">
                    {nestedField.label}
                  </span>
                  {nestedField.required && (
                    <span className="text-error">*</span>
                  )}
                </label>
                {renderField(nestedField)}
              </div>
            );
          })}
        </div>
      );
    }

    // Add notice for home insurance fire safety measures
    if (selectedType === 'home' && field.id === 'fire_safety') {
      return (
        <div className="space-y-4">
          <div className="alert alert-info">
            <Info className="h-4 w-4" />
            <div className="text-sm text-gray-500 mt-1">
              {t('fireSafetyNote')}
            </div>
          </div>
          <div className="flex flex-row gap-2 flex-wrap max-w-full">
            {field.options?.map((option) => (
              <label key={option} className="label cursor-pointer">
                <span className="label-text text-wrap my-2">{option}</span>
                <input
                  type="checkbox"
                  name={`${field.id}[]`}
                  value={option}
                  required={field.required}
                  className="checkbox"
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
        </div>
      );
    }

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            name={field.id}
            required={field.required}
            className="input input-bordered w-full"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'number':
        return (
          <input
            type="number"
            name={field.id}
            required={field.required}
            className="input input-bordered w-full"
            min={field.validation?.min}
            max={field.validation?.max}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'date':
        const today = new Date();
        const minDate = new Date();
        minDate.setFullYear(1930); // Set minimum year to 1930
        const maxDate = new Date();

        // For health insurance, allow all ages
        if (selectedType === 'health') {
          maxDate.setFullYear(today.getFullYear());
        } else {
          maxDate.setFullYear(today.getFullYear() - 18); // 18 years ago for other types
        }

        return (
          <input
            type="date"
            name={field.id}
            required={field.required}
            className="input input-bordered w-full"
            min={minDate.toISOString().split('T')[0]}
            max={maxDate.toISOString().split('T')[0]}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          />
        );
      case 'select':
        if (field.dynamicOptions) {
          const options =
            stateOptions[formData[field.dynamicOptions.dependsOn]] || [];
          return (
            <div className="space-y-2">
              <select
                defaultValue={selectedType === 'home' ? 'N/A' : ''}
                name={field.id}
                required={field.required}
                className="select select-bordered w-full"
                onChange={(e) => handleInputChange(field.id, e.target.value)}
              >
                {selectedType === 'home' ? (
                  <option value="N/A">N/A</option>
                ) : (
                  <option value="" disabled label={t('selectPlaceholder')} />
                )}
                {options.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {field.id === 'state' && selectedType === 'home' && (
                <div className="alert alert-warning">
                  <Info className="h-4 w-4" />
                  <span>{t('stateSelectionNote')}</span>
                </div>
              )}
            </div>
          );
        }

        if (!field.options) {
          showAlertMessage(t('noOptionsWarning'), 'warning');
          return null;
        }

        return (
          <select
            defaultValue=""
            name={field.id}
            required={field.required}
            className="select select-bordered w-full"
            onChange={(e) => handleInputChange(field.id, e.target.value)}
          >
            <option value="" disabled label={t('selectPlaceholder')} />
            {field.options.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        );
      case 'radio':
        if (!field.options) {
          showAlertMessage(t('noOptionsWarning'), 'warning');
          return null;
        }

        // Special handling for health insurance gender selection
        if (selectedType === 'health' && field.id === 'gender') {
          return (
            <div className="space-y-2">
              <div className="alert alert-warning">
                <Info className="h-4 w-4" />
                <div className="text-sm text-gray-500 mt-1">
                  {t('genderNote')}
                </div>
              </div>
              <div className="flex flex-row gap-2 flex-wrap max-w-full">
                {field.options.map((option) => (
                  <label key={option} className="label cursor-pointer">
                    <span className="label-text text-wrap my-2">{option}</span>
                    <input
                      type="radio"
                      name={field.id}
                      value={option}
                      required={
                        field.required && field.id !== 'has_safety_measures'
                      }
                      className="radio"
                      onChange={(e) =>
                        handleInputChange(field.id, e.target.value)
                      }
                    />
                  </label>
                ))}
              </div>
            </div>
          );
        }

        return (
          <div className="flex flex-row gap-2 flex-wrap max-w-full">
            {field.options.map((option) => (
              <label key={option} className="label cursor-pointer">
                <span className="label-text text-wrap my-2">{option}</span>
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  required={
                    field.required && field.id !== 'has_safety_measures'
                  }
                  className="radio"
                  onChange={(e) => handleInputChange(field.id, e.target.value)}
                />
              </label>
            ))}
          </div>
        );
      case 'checkbox':
        if (!field.options) {
          showAlertMessage(t('noOptionsWarning'), 'warning');
          return null;
        }

        // Special handling for home insurance safety measures
        if (field.id === 'has_safety_measures') {
          return (
            <div className="space-y-4">
              <div className="alert alert-info">
                <Info className="h-4 w-4" />
                <div className="text-sm text-gray-500 mt-1">
                  {t('requiredOptionsNote')}
                </div>
              </div>
              <div className="flex flex-row gap-2 flex-wrap max-w-full">
                {field.options.map((option) => (
                  <label key={option} className="label cursor-pointer">
                    <span className="label-text text-wrap my-2">{option}</span>
                    <input
                      type="checkbox"
                      name={`${field.id}[]`}
                      value={option}
                      required={false}
                      className="checkbox"
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
            </div>
          );
        }

        return (
          <div className="flex flex-row gap-2 flex-wrap max-w-full">
            {field.options.map((option) => (
              <label key={option} className="label cursor-pointer">
                <span className="label-text text-wrap my-2">{option}</span>
                <input
                  type="checkbox"
                  name={`${field.id}[]`}
                  value={option}
                  required={field.required}
                  className="checkbox"
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
          showAlertMessage(t('noNestedFieldsWarning'), 'warning');
          return null;
        }

        return (
          <div className="space-y-4">
            {field.fields.map((nestedField) => {
              if (!isFieldVisible(nestedField)) return null;

              // Special handling for car insurance year of manufacture
              if (nestedField.id === 'year_of_manufacture') {
                return (
                  <div key={nestedField.id} className="form-control">
                    <label className="label">
                      <span className="label-text text-wrap my-2">
                        {nestedField.label}
                      </span>
                      {nestedField.required && (
                        <span className="text-error">*</span>
                      )}
                    </label>
                    <input
                      type="number"
                      name={nestedField.id}
                      required={nestedField.required}
                      className="input input-bordered w-full"
                      min={1990}
                      max={2025}
                      onChange={(e) => {
                        const value = e.target.value;
                        // Reset to 1990 if more than 4 digits or outside range
                        if (
                          value.length > 4 ||
                          parseInt(value) < 1990 ||
                          parseInt(value) > 2025
                        ) {
                          e.target.value = '1990';
                          handleInputChange(nestedField.id, '1990');
                        } else {
                          handleInputChange(nestedField.id, value);
                        }
                      }}
                      onKeyPress={(e) => {
                        // Prevent typing more than 4 digits
                        if (e.currentTarget.value.length >= 4) {
                          e.preventDefault();
                        }
                      }}
                      onBlur={(e) => {
                        const value = e.target.value;
                        // Validate on blur
                        if (
                          value.length > 4 ||
                          parseInt(value) < 1990 ||
                          parseInt(value) > 2025
                        ) {
                          e.target.value = '1990';
                          handleInputChange(nestedField.id, '1990');
                        }
                      }}
                    />
                  </div>
                );
              }

              return (
                <div key={nestedField.id} className="form-control">
                  <label className="label">
                    <span className="label-text text-wrap my-2">
                      {nestedField.label}
                    </span>
                    {nestedField.required && (
                      <span className="text-error">*</span>
                    )}
                  </label>
                  {renderField(nestedField)}
                </div>
              );
            })}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert */}
      {showAlert && (
        <div
          className={`alert ${
            alertType === 'error'
              ? 'alert-error'
              : alertType === 'warning'
                ? 'alert-warning'
                : 'alert-success'
          } fixed top-4 right-4 z-50 shadow-lg`}
        >
          {alertType === 'error' ? (
            <AlertTriangle className="h-6 w-6" />
          ) : alertType === 'warning' ? (
            <Info className="h-6 w-6" />
          ) : (
            <Check className="h-6 w-6" />
          )}
          <span>{alertMessage}</span>
        </div>
      )}

      <div className="flex flex-row flex-wrap gap-4 justify-center items-center max-w-full">
        <button
          type="button"
          className={`btn ${selectedType === 'health' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('health')}
        >
          <Heart className="h-5 w-5 mr-2" />
          Health Insurance
        </button>
        <button
          type="button"
          className={`btn ${selectedType === 'home' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('home')}
        >
          <Home className="h-5 w-5 mr-2" />
          Home Insurance
        </button>
        <button
          type="button"
          className={`btn ${selectedType === 'car' ? 'btn-primary' : 'btn-outline'}`}
          onClick={() => setSelectedType('car')}
        >
          <Car className="h-5 w-5 mr-2" />
          Car Insurance
        </button>
      </div>

      {selectedForm ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <h2 className="text-2xl font-bold">{selectedForm.title}</h2>

          {selectedForm.fields.map((field) => {
            if (!isFieldVisible(field)) return null;

            return (
              <div key={field.id} className="form-control">
                <label className="label">
                  <span className="label-text text-wrap my-2">
                    {field.label}
                  </span>
                  {field.required && <span className="text-error">*</span>}
                </label>
                {renderField(field)}
              </div>
            );
          })}

          {error && (
            <div className="alert alert-error">
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary w-full"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? t('submitting') : t('submit')}
          </button>
        </form>
      ) : (
        <div className="text-center p-8 bg-base-200 rounded-lg">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 text-base-content/50" />
          <p className="text-lg">{t('selectInsuranceType')}</p>
        </div>
      )}
    </div>
  );
}
