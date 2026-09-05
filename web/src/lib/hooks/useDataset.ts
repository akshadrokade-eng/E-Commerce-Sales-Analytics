'use client';

import { useState, useEffect, useCallback } from 'react';

const API_BASE = 'http://127.0.0.1:8000';

interface DatasetInfo {
  has_dataset: boolean;
  filename?: string;
  rows?: number;
  columns?: number;
  unique_customers?: number;
  last_updated?: string;
}

interface UseDatasetResult {
  hasDataset: boolean;
  datasetInfo: DatasetInfo | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function fetchDataset(
  setHasDataset: (v: boolean) => void,
  setDatasetInfo: (v: DatasetInfo | null) => void,
  setError: (v: string | null) => void,
  setLoading: (v: boolean) => void
) {
  fetch(`${API_BASE}/api/dataset`)
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        setHasDataset(data.has_dataset);
        setDatasetInfo(
          data.has_dataset && data.metadata
            ? {
                has_dataset: true,
                filename: data.metadata.filename,
                rows: data.metadata.rows,
                columns: data.metadata.columns,
                unique_customers: data.metadata.unique_customers,
                last_updated: data.metadata.last_updated,
              }
            : { has_dataset: false }
        );
      } else {
        setError(data.message || 'Failed to check dataset');
        setHasDataset(false);
      }
    })
    .catch(() => {
      setHasDataset(false);
      setDatasetInfo({ has_dataset: false });
    })
    .finally(() => {
      setLoading(false);
    });
}

export function useDataset(): UseDatasetResult {
  const [hasDataset, setHasDataset] = useState(false);
  const [datasetInfo, setDatasetInfo] = useState<DatasetInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    fetchDataset(setHasDataset, setDatasetInfo, setError, setLoading);
  }, [trigger]);

  const refresh = useCallback(() => {
    setLoading(true);
    setError(null);
    setTrigger((prev) => prev + 1);
  }, []);

  return { hasDataset, datasetInfo, loading, error, refresh };
}
