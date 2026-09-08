export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export const api = {
  dataset: `${API_BASE_URL}/api/dataset`,
  preview: `${API_BASE_URL}/api/preview`,
  upload: `${API_BASE_URL}/api/upload`,
  reset: `${API_BASE_URL}/api/reset`,
  health: `${API_BASE_URL}/health`,
  data: {
    summary: `${API_BASE_URL}/api/data/summary`,
    category: `${API_BASE_URL}/api/data/category`,
    region: `${API_BASE_URL}/api/data/region`,
    payment: `${API_BASE_URL}/api/data/payment`,
    yearly: `${API_BASE_URL}/api/data/yearly`,
    monthly: `${API_BASE_URL}/api/data/monthly`,
    customers: `${API_BASE_URL}/api/data/customers`,
    operations: `${API_BASE_URL}/api/data/operations`,
    relationships: `${API_BASE_URL}/api/data/relationships`,
    metadata: `${API_BASE_URL}/api/data/metadata`,
  },
};
