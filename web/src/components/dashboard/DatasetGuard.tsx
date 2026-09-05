'use client';

import { useDataset } from '@/lib/hooks/useDataset';
import NoDataset from './NoDataset';
import { motion } from 'framer-motion';

interface DatasetGuardProps {
  children: React.ReactNode;
}

export default function DatasetGuard({ children }: DatasetGuardProps) {
  const { hasDataset, loading, refresh } = useDataset();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"
          />
          <p className="text-gray-400">Checking dataset...</p>
        </div>
      </div>
    );
  }

  if (!hasDataset) {
    return <NoDataset onUploadSuccess={refresh} />;
  }

  return <>{children}</>;
}
