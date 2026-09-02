'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { formatNumber } from '@/lib/utils/format';

interface RatingBin {
  rating: number;
  count: number;
}

interface RatingDistributionProps {
  data: RatingBin[];
}

function groupRatings(data: RatingBin[]): Array<{ range: string; count: number }> {
  const groups = [
    { label: '1.0-1.4', min: 1.0, max: 1.4 },
    { label: '1.5-1.9', min: 1.5, max: 1.9 },
    { label: '2.0-2.4', min: 2.0, max: 2.4 },
    { label: '2.5-2.9', min: 2.5, max: 2.9 },
    { label: '3.0-3.4', min: 3.0, max: 3.4 },
    { label: '3.5-3.9', min: 3.5, max: 3.9 },
    { label: '4.0-4.4', min: 4.0, max: 4.4 },
    { label: '4.5-5.0', min: 4.5, max: 5.0 },
  ];

  return groups.map((g) => ({
    range: g.label,
    count: data
      .filter((d) => d.rating >= g.min && d.rating <= g.max)
      .reduce((sum, d) => sum + d.count, 0),
  }));
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { range: string; count: number } }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">Rating: {d.range}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-gray-400">Orders</span>
        <span className="text-sm font-semibold text-white">{formatNumber(d.count)}</span>
      </div>
    </div>
  );
}

export default function RatingDistribution({ data }: RatingDistributionProps) {
  const grouped = groupRatings(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.25 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Star className="w-4 h-4 text-blue-400" />
          Customer Rating Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Orders grouped by customer rating</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={grouped} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="range"
              stroke="#6b7280"
              tick={{ fontSize: 10, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
