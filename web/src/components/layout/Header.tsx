'use client';

import { motion } from 'framer-motion';
import DatasetUpload from '@/components/dashboard/DatasetUpload';

interface HeaderProps {
  title: string;
  subtitle?: string;
  totalOrders?: number;
}

export default function Header({ title, subtitle, totalOrders }: HeaderProps) {
  return (
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
        {totalOrders && (
          <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
            <span className="text-xs text-gray-400">Dataset</span>
            <span className="text-xs font-medium text-white">{totalOrders.toLocaleString('en-IN')} orders</span>
          </div>
        )}
        <DatasetUpload />
        <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-800/50 border border-gray-700/50 rounded-lg">
          <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-400">Loaded</span>
        </div>
      </div>
    </motion.header>
  );
}
