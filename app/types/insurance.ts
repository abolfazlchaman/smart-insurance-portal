export interface InsuranceForm {
  id: string;
  type: InsuranceType;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  type: 'text' | 'number' | 'select' | 'radio' | 'checkbox' | 'date' | 'address' | 'vehicle' | 'group';
  label: string;
  required: boolean;
  placeholder?: string;
  options?: FormOption[];
  conditions?: FormCondition[];
  validation?: FormValidation;
  nestedFields?: FormField[];
}

export interface FormOption {
  value: string;
  label: string;
}

export interface FormCondition {
  fieldId: string;
  operator: 'equals' | 'notEquals' | 'greaterThan' | 'lessThan' | 'contains';
  value: string | number | boolean;
}

export interface FormValidation {
  min?: number;
  max?: number;
  pattern?: string;
  custom?: (value: any) => boolean;
}

export interface InsuranceSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export type InsuranceType = 'health' | 'home' | 'car' | 'life';

export interface ListViewConfig {
  columns: string[];
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  filters?: Record<string, any>;
  page: number;
  pageSize: number;
} 