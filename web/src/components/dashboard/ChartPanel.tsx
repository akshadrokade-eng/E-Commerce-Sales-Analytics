'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ChartPanelProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function ChartPanel({
  title,
  children,
  className = '',
}: ChartPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`bg-gray-800/50 border border-gray-700/50 rounded-xl p-6 ${className}`}
    >
      <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      {children}
    </motion.div>
  );
}
