'use client';

import { motion } from 'framer-motion';
import { Database, Plus } from 'lucide-react';
import { useState } from 'react';
import DatasetUpload from './DatasetUpload';

interface NoDatasetProps {
  onUploadSuccess?: () => void;
}

export default function NoDataset({ onUploadSuccess }: NoDatasetProps) {
  const [showUpload, setShowUpload] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-center min-h-[60vh]"
      >
        <div className="text-center max-w-md mx-auto px-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-20 h-20 bg-gray-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-gray-700/50"
          >
            <Database className="w-10 h-10 text-gray-500" />
          </motion.div>
          
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl font-semibold text-white mb-2"
          >
            Data Not Found
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-gray-400 text-sm mb-6"
          >
            Please add a dataset to continue.
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            onClick={() => setShowUpload(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium"
          >
            <Plus className="w-4 h-4" />
            Add the Dataset
          </motion.button>
        </div>
      </motion.div>

      {showUpload && (
        <DatasetUpload
          autoOpen={true}
          onClose={() => setShowUpload(false)}
          onSuccess={onUploadSuccess}
        />
      )}
    </>
  );
}
