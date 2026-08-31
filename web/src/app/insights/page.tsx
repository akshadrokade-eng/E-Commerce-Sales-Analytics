'use client';

import Header from '@/components/layout/Header';
import { motion } from 'framer-motion';

export default function InsightsPage() {
  return (
    <div className="space-y-8">
      <Header
        title="Insights"
        subtitle="Data relationships and findings"
      />
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-12 text-center"
      >
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">Coming Soon</h3>
          <p className="text-gray-400">
            Advanced insights with correlation analysis and predictive findings will be available in the next phase.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
