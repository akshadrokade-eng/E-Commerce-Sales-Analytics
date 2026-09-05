'use client';

import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileSpreadsheet,
  CheckCircle,
  AlertTriangle,
  X,
  RotateCcw,
  Database,
} from 'lucide-react';

const API_BASE = 'http://127.0.0.1:8000';

interface DatasetMetadata {
  filename: string;
  rows: number;
  columns: number;
  date_min: string;
  date_max: string;
  last_updated: string;
  unique_customers: number;
  unique_categories: number;
  unique_regions: number;
}

interface PreviewData {
  filename: string;
  file_size: number;
  rows: number;
  columns: number;
  column_names: string[];
  preview: Record<string, unknown>[];
}

interface UploadResult {
  success: boolean;
  filename?: string;
  rows?: number;
  columns?: number;
  message: string;
  metadata?: DatasetMetadata;
  missing_columns?: string[];
}

type UploadState = 'idle' | 'preview' | 'uploading' | 'validating' | 'processing' | 'success' | 'error';

export default function DatasetUpload() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<UploadState>('idle');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewData | null>(null);
  const [result, setResult] = useState<UploadResult | null>(null);
  const [metadata, setMetadata] = useState<DatasetMetadata | null>(null);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please select a CSV file.');
      setState('error');
      return;
    }

    setSelectedFile(file);
    setState('preview');
    setError('');

    // Get preview
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/api/preview`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        setPreview(data.preview);
      } else {
        setError(data.message || 'Failed to preview file');
        setState('error');
      }
    } catch {
      setError('Cannot connect to backend. Please start the Python API server.');
      setState('error');
    }
  }, []);

  const handleUpload = useCallback(async () => {
    if (!selectedFile) return;

    setState('uploading');

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      // Simulate stages
      setTimeout(() => setState('validating'), 500);
      setTimeout(() => setState('processing'), 1000);

      const response = await fetch(`${API_BASE}/api/upload`, {
        method: 'POST',
        body: formData,
      });

      const data: UploadResult = await response.json();

      if (data.success) {
        setResult(data);
        setMetadata(data.metadata || null);
        setState('success');

        // Refresh the page after a short delay to show new data
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setError(data.message);
        setResult(data);
        setState('error');
      }
    } catch {
      setError('Cannot connect to backend. Please start the Python API server.');
      setState('error');
    }
  }, [selectedFile]);

  const handleReset = useCallback(async () => {
    setState('uploading');
    try {
      const response = await fetch(`${API_BASE}/api/reset`, {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMetadata(null);
        setState('idle');
        setSelectedFile(null);
        setPreview(null);
        setResult(null);
        window.location.reload();
      } else {
        setError(data.message || 'Reset failed');
        setState('error');
      }
    } catch {
      setError('Cannot connect to backend');
      setState('error');
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setState('idle');
      setSelectedFile(null);
      setPreview(null);
      setResult(null);
      setError('');
    }, 300);
  };

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
      >
        <Database className="w-4 h-4" />
        <span className="hidden sm:inline">Dataset</span>
      </button>

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={handleClose}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-2xl bg-gray-900 border border-gray-700/50 rounded-xl shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <FileSpreadsheet className="w-5 h-5 text-blue-400" />
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-white">Dataset Management</h2>
                    <p className="text-xs text-gray-400">Upload a compatible e-commerce CSV dataset</p>
                  </div>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Current Dataset Info */}
                {metadata && (
                  <div className="mb-6 p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-300">Current Dataset</h3>
                      <button
                        onClick={handleReset}
                        disabled={state === 'uploading'}
                        className="flex items-center gap-1.5 px-2 py-1 text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded transition-colors disabled:opacity-50"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Reset to Default
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
                      <div>
                        <p className="text-gray-500 text-xs">File</p>
                        <p className="text-white truncate">{metadata.filename}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Rows</p>
                        <p className="text-white">{metadata.rows.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Customers</p>
                        <p className="text-white">{metadata.unique_customers.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Updated</p>
                        <p className="text-white">{new Date(metadata.last_updated).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Upload Area */}
                {state === 'idle' && (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-gray-700 hover:border-blue-500/50 rounded-xl p-8 text-center cursor-pointer transition-all duration-200 hover:bg-gray-800/30"
                  >
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-300 font-medium mb-1">Click to select a CSV file</p>
                    <p className="text-xs text-gray-500">
                      Required columns: order_id, order_date, customer_id, product_category, region,
                      quantity, unit_price, discount, payment_method, delivery_days, customer_rating, revenue
                    </p>
                  </div>
                )}

                {/* Preview */}
                {state === 'preview' && preview && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 bg-gray-800/50 rounded-lg">
                      <FileSpreadsheet className="w-8 h-8 text-blue-400" />
                      <div className="flex-1">
                        <p className="text-white font-medium">{preview.filename}</p>
                        <p className="text-xs text-gray-400">
                          {preview.rows.toLocaleString()} rows · {preview.columns} columns · {formatFileSize(preview.file_size)}
                        </p>
                      </div>
                    </div>

                    {/* Column List */}
                    <div>
                      <p className="text-xs text-gray-400 mb-2">Detected Columns:</p>
                      <div className="flex flex-wrap gap-1.5">
                        {preview.column_names.map((col) => (
                          <span
                            key={col}
                            className="px-2 py-0.5 text-xs bg-gray-800 text-gray-300 rounded"
                          >
                            {col}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Preview Table */}
                    <div className="overflow-x-auto">
                      <table className="w-full text-xs">
                        <thead>
                          <tr className="border-b border-gray-800">
                            {preview.column_names.slice(0, 8).map((col) => (
                              <th key={col} className="px-2 py-1.5 text-left text-gray-400 font-medium">
                                {col}
                              </th>
                            ))}
                            {preview.column_names.length > 8 && (
                              <th className="px-2 py-1.5 text-gray-500">...</th>
                            )}
                          </tr>
                        </thead>
                        <tbody>
                          {preview.preview.slice(0, 5).map((row, i) => (
                            <tr key={i} className="border-b border-gray-800/50">
                              {preview.column_names.slice(0, 8).map((col) => (
                                <td key={col} className="px-2 py-1.5 text-gray-300">
                                  {String(row[col] ?? '-').slice(0, 20)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 pt-2">
                      <button
                        onClick={() => {
                          setState('idle');
                          setSelectedFile(null);
                          setPreview(null);
                        }}
                        className="flex-1 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleUpload}
                        className="flex-1 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
                      >
                        Process Dataset
                      </button>
                    </div>
                  </div>
                )}

                {/* Processing States */}
                {(state === 'uploading' || state === 'validating' || state === 'processing') && (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-white font-medium">
                      {state === 'uploading' && 'Uploading...'}
                      {state === 'validating' && 'Validating dataset...'}
                      {state === 'processing' && 'Processing data...'}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {state === 'processing' && 'Generating analytics...'}
                    </p>
                  </div>
                )}

                {/* Success */}
                {state === 'success' && result && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-6"
                  >
                    <CheckCircle className="w-16 h-16 text-emerald-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-white mb-2">Dataset Processed Successfully</h3>
                    <p className="text-gray-400 text-sm mb-4">{result.message}</p>
                    <div className="flex justify-center gap-6 text-sm">
                      <div>
                        <p className="text-gray-500">Rows</p>
                        <p className="text-white font-medium">{result.rows?.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Columns</p>
                        <p className="text-white font-medium">{result.columns}</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-4">Dashboard will refresh shortly...</p>
                  </motion.div>
                )}

                {/* Error */}
                {state === 'error' && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-6"
                  >
                    <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
                      <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-red-400 font-medium">{error}</p>
                        {result?.missing_columns && result.missing_columns.length > 0 && (
                          <div className="mt-2">
                            <p className="text-xs text-gray-400">Missing columns:</p>
                            <ul className="mt-1 space-y-0.5">
                              {result.missing_columns.map((col) => (
                                <li key={col} className="text-xs text-red-300">- {col}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setState('idle');
                        setSelectedFile(null);
                        setPreview(null);
                        setResult(null);
                        setError('');
                      }}
                      className="mt-4 w-full px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition-colors"
                    >
                      Try Again
                    </button>
                  </motion.div>
                )}
              </div>

              {/* Hidden file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
