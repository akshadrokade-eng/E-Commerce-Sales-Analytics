'use client';

import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { GitCompare } from 'lucide-react';
import { formatCorrelation, getCorrelationStrength, getCorrelationDirection } from '@/lib/utils/format';

interface DeliveryRatingPoint {
  delivery_days: number;
  customer_rating: number;
}

interface DeliveryRatingScatterProps {
  data: DeliveryRatingPoint[];
  correlation: number;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DeliveryRatingPoint }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Delivery</span>
          <span className="text-sm text-white">{d.delivery_days} days</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Rating</span>
          <span className="text-sm font-semibold text-white">{d.customer_rating.toFixed(1)} / 5.0</span>
        </div>
      </div>
    </div>
  );
}

export default function DeliveryRatingScatter({ data, correlation }: DeliveryRatingScatterProps) {
  const strength = getCorrelationStrength(correlation);
  const direction = getCorrelationDirection(correlation);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <GitCompare className="w-4 h-4 text-blue-400" />
          Delivery Days vs Customer Rating
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Scatter plot of delivery time against rating</p>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              dataKey="delivery_days"
              name="Delivery Days"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              label={{ value: 'Delivery Days', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 10 }}
            />
            <YAxis
              type="number"
              dataKey="customer_rating"
              name="Rating"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={40}
              label={{ value: 'Rating', angle: -90, position: 'insideLeft', fill: '#6b7280', fontSize: 10 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3', stroke: '#4b5563' }} />
            <Scatter data={data} fill="#3b82f6" fillOpacity={0.4} r={3} />
          </ScatterChart>
        </ResponsiveContainer>
      </div>
      {/* Correlation explanation */}
      <div className="mt-4 pt-4 border-t border-gray-700/50">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-gray-300">Correlation</span>
          <span className="text-sm font-semibold text-white font-mono">{formatCorrelation(correlation)}</span>
        </div>
        <p className="text-xs text-gray-400">{strength} {direction.toLowerCase()} relationship</p>
        <p className="text-[11px] text-gray-500 mt-2">
          Correlation does not imply causation. The dataset shows a {strength.toLowerCase()} linear relationship between delivery days and customer rating.
        </p>
      </div>
    </motion.div>
  );
}
