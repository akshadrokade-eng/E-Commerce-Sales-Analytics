'use client';

import { motion } from 'framer-motion';
import { GitCompare, Info } from 'lucide-react';
import { formatCorrelation, getCorrelationStrength, getCorrelationDirection } from '@/lib/utils/format';

interface RelationshipsProps {
  data: {
    quantity_revenue_correlation: number;
    discount_revenue_correlation: number;
    delivery_rating_correlation: number;
  };
}

const correlations = [
  { key: 'quantity_revenue_correlation', label: 'Quantity \u2194 Revenue', icon: '\ud83d\udce6' },
  { key: 'discount_revenue_correlation', label: 'Discount \u2194 Revenue', icon: '\ud83c\udf81' },
  { key: 'delivery_rating_correlation', label: 'Delivery Days \u2194 Rating', icon: '\ud83d\ude9a' },
] as const;

function getBarWidth(value: number): number {
  return Math.min(Math.abs(value) * 100, 100);
}

function getBarColor(value: number): string {
  if (value > 0.3) return 'bg-blue-500';
  if (value > 0.1) return 'bg-blue-400/70';
  if (value < -0.3) return 'bg-amber-500';
  if (value < -0.1) return 'bg-amber-400/70';
  return 'bg-gray-500';
}

export default function RelationshipPreview({ data }: RelationshipsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <GitCompare className="w-4 h-4 text-blue-400" />
            Data Relationships
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Correlation between metrics</p>
        </div>
      </div>
      <div className="space-y-4">
        {correlations.map(({ key, label }) => {
          const value = data[key];
          const strength = getCorrelationStrength(value);
          const direction = getCorrelationDirection(value);
          const barColor = getBarColor(value);
          return (
            <div key={key}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-gray-300">{label}</span>
                <span className="text-sm font-semibold text-white font-mono">{formatCorrelation(value)}</span>
              </div>
              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${getBarWidth(value)}%` }}
                />
              </div>
              <p className="text-[11px] text-gray-500 mt-1">{strength} {direction.toLowerCase()} relationship</p>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-700/50 flex items-start gap-2">
        <Info className="w-3.5 h-3.5 text-gray-500 mt-0.5 flex-shrink-0" />
        <p className="text-[10px] text-gray-500 leading-relaxed">
          Correlation does not imply causation. These values indicate statistical relationships only.
        </p>
      </div>
    </motion.div>
  );
}
