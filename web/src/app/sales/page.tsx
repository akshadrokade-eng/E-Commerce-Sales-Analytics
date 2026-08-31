'use client';

import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';

export default function SalesPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Sales Analytics"
        description="Detailed sales performance metrics"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400">
            Detailed sales analytics with advanced filtering and breakdowns will be available in the next phase.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
