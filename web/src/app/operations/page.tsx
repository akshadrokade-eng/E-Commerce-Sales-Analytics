'use client';

import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';

export default function OperationsPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Operations"
        subtitle="Delivery and operational performance"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-amber-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400">
            Operations analytics with delivery metrics and performance insights will be available in the next phase.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
