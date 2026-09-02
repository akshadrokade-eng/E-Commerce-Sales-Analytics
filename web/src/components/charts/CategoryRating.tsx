'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

interface CategoryRating {
  category: string;
  average_rating: number;
}

interface CategoryRatingProps {
  data: CategoryRating[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryRating }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.category}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-gray-400">Avg Rating</span>
        <span className="text-sm font-semibold text-white">{d.average_rating.toFixed(2)} / 5.0</span>
      </div>
    </div>
  );
}

export default function CategoryRating({ data }: CategoryRatingProps) {
  const sorted = [...data].sort((a, b) => b.average_rating - a.average_rating);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Award className="w-4 h-4 text-blue-400" />
          Rating by Product Category
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Average customer rating per category</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis
              type="number"
              domain={[2.5, 3.2]}
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              tickFormatter={(v) => v.toFixed(1)}
            />
            <YAxis
              type="category"
              dataKey="category"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#d1d5db' }}
              axisLine={false}
              tickLine={false}
              width={90}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar dataKey="average_rating" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={24} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
