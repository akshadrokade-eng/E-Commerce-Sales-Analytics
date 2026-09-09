'use client';

import { useState, useEffect } from 'react';
import { api, fetchWithSession } from '@/lib/api';

type DataKey = 'summary' | 'category' | 'region' | 'payment' | 'yearly' | 'monthly' | 'customers' | 'operations' | 'relationships' | 'metadata';

interface UseDashboardDataResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

export function useDashboardData<T>(key: DataKey): UseDashboardDataResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = api.data[key];
    fetchWithSession(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (json.success === false) {
          setError(json.message || 'No dataset available');
        } else {
          setData(json);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load data.');
        setLoading(false);
      });
  }, [key]);

  return { data, loading, error };
}

export function useDashboardDataAll<T>(
  keys: DataKey[]
): { data: T | null; loading: boolean; error: string | null } {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const urls = keys.map((k) => api.data[k]);
    Promise.all(urls.map((url) => fetchWithSession(url).then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })))
      .then((results) => {
        const hasError = results.some((r) => r.success === false);
        if (hasError) {
          setError('No dataset available');
        } else {
          const merged = {} as T;
          keys.forEach((k, i) => {
            (merged as Record<string, unknown>)[k] = results[i];
          });
          setData(merged);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Unable to load dashboard data.');
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keys.join(',')]);

  return { data, loading, error };
}
