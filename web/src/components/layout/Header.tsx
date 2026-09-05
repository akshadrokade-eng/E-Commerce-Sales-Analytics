'use client';

import { motion } from 'framer-motion';
import DatasetUpload from '@/components/dashboard/DatasetUpload';
import { useDataset } from '@/lib/hooks/useDataset';
import { Plus } from 'lucide-react';
import { useState } from 'react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  totalOrders?: number;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { hasDataset, datasetInfo, refresh } = useDataset();
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8"
      >
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-white tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-1 text-sm text-gray-400">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center gap-3">
          {hasDataset && datasetInfo?.rows && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <span className="text-xs text-gray-400">Dataset</span>
              <span className="text-xs font-medium text-white">{datasetInfo.rows.toLocaleString('en-IN')} rows</span>
            </div>
          )}
          <button
            onClick={() => setShowUpload(true)}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-700/50 border border-gray-700/50 rounded-lg text-sm text-gray-300 hover:text-white transition-all duration-200"
          >
            {hasDataset ? (
              <>
                <DatasetIcon />
                <span className="hidden sm:inline">Change Dataset</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add the Dataset</span>
              </>
            )}
          </button>
          {hasDataset && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-xs text-gray-400">Loaded</span>
            </div>
          )}
        </div>
      </motion.header>

      {showUpload && (
        <DatasetUpload
          autoOpen={true}
          onClose={() => {
            setShowUpload(false);
            refresh();
          }}
          onSuccess={() => {
            refresh();
          }}
        />
      )}
    </>
  );
}

function DatasetIcon() {
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
    </svg>
  );
}
