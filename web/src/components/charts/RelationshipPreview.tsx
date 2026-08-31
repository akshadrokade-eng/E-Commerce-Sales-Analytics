'use client';

import { motion } from 'framer-motion';
import { Correlations } from '@/types';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

interface RelationshipPreviewProps {
  correlations: Correlations;
}

function getCorrelationLabel(value: number): string {
  if (value > 0.3) return 'Positive relationship';
  if (value < -0.3) return 'Negative relationship';
  if (value > 0.1) return 'Weak positive';
  if (value < -0.1) return 'Weak negative';
  return 'Very weak relationship';
}

function getCorrelationIcon(value: number) {
  if (value > 0.1) return <ArrowUpRight className="w-4 h-4 text-emerald-400" />;
  if (value < -0.1) return <ArrowDownRight className="w-4 h-4 text-red-400" />;
  return <Minus className="w-4 h-4 text-gray-400" />;
}

function getCorrelationColor(value: number): string {
  if (value > 0.3) return 'text-emerald-400';
  if (value < -0.3) return 'text-red-400';
  if (value > 0.1) return 'text-emerald-400';
  if (value < -0.1) return 'text-red-400';
  return 'text-gray-400';
}

export default function RelationshipPreview({ correlations }: RelationshipPreviewProps) {
  const relationships = [
    {
      label: 'Quantity ↔ Revenue',
      value: correlations.quantity_revenue_correlation,
      description: 'How order quantity relates to revenue',
    },
    {
      label: 'Discount ↔ Revenue',
      value: correlations.discount_revenue_correlation,
      description: 'How discount levels relate to revenue',
    },
    {
      label: 'Delivery ↔ Rating',
      value: correlations.delivery_rating_correlation,
      description: 'How delivery time relates to customer rating',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Data Relationships</h3>
        <p className="text-sm text-gray-400">Analytical correlations in the dataset</p>
      </div>
      <div className="space-y-4">
        {relationships.map((rel) => (
          <div
            key={rel.label}
            className="flex items-center justify-between p-3 bg-gray-700/30 rounded-lg"
          >
            <div className="flex items-center gap-3">
              {getCorrelationIcon(rel.value)}
              <div>
                <p className="text-sm font-medium text-white">{rel.label}</p>
                <p className="text-xs text-gray-400">{rel.description}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-sm font-medium ${getCorrelationColor(rel.value)}`}>
                {rel.value.toFixed(4)}
              </p>
              <p className="text-xs text-gray-500">
                {getCorrelationLabel(rel.value)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
