import { InsuranceForm, InsuranceSubmission, ListViewConfig } from '../types/insurance';

const BASE_URL = 'https://assignment.devotel.io';

export async function fetchInsuranceForms(): Promise<InsuranceForm[]> {
  const response = await fetch(`${BASE_URL}/api/insurance/forms`);
  if (!response.ok) {
    throw new Error('Failed to fetch insurance forms');
  }
  return response.json();
}

export async function submitInsuranceForm(formData: Record<string, any>): Promise<InsuranceSubmission> {
  const response = await fetch(`${BASE_URL}/api/insurance/forms/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });
  
  if (!response.ok) {
    throw new Error('Failed to submit insurance form');
  }

  // Return a transformed response that matches our InsuranceSubmission type
  return {
    id: formData.id,
    formId: formData['Insurance Type'].toLowerCase().replace(' ', '_') + '_application',
    data: formData,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export async function fetchSubmissions(config: ListViewConfig): Promise<{
  columns: string[];
  data: InsuranceSubmission[];
  total: number;
}> {
  const queryParams = new URLSearchParams({
    page: config.page.toString(),
    pageSize: config.pageSize.toString(),
    ...(config.sortBy && { sortBy: config.sortBy }),
    ...(config.sortDirection && { sortDirection: config.sortDirection }),
    ...(config.filters && { filters: JSON.stringify(config.filters) }),
  });

  const response = await fetch(`${BASE_URL}/api/insurance/forms/submissions?${queryParams}`);
  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  const result = await response.json();
  // Transform the data to match our InsuranceSubmission type
  const transformedData = result.data.map((item: any) => ({
    id: item.id,
    formId: item['Insurance Type']?.toLowerCase().replace(' ', '_') + '_application' || 'unknown',
    data: item,
    status: 'pending',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return {
    columns: result.columns,
    data: transformedData,
    total: result.data.length,
  };
}

interface StatesResponse {
  country: string;
  states: string[];
}

export async function fetchStates(country: string): Promise<string[]> {
  const response = await fetch(`${BASE_URL}/api/getStates?country=${country}`);
  if (!response.ok) {
    throw new Error('Failed to fetch states');
  }
  const data: StatesResponse = await response.json();
  return data.states;
} 