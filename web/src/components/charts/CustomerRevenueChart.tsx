'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { BarChart3 } from 'lucide-react';
import { formatNumber } from '@/lib/utils/format';

interface Customer {
  customer_id: number;
  total_orders: number;
  total_revenue: number;
}

interface CustomerRevenueChartProps {
  data: Customer[];
}

interface RevenueBin {
  range: string;
  count: number;
}

function buildRevenueBins(data: Customer[]): RevenueBin[] {
  const revenues = data.map((c) => c.total_revenue).sort((a, b) => a - b);
  const min = revenues[0];
  const max = revenues[revenues.length - 1];
  const binCount = 8;
  const binWidth = (max - min) / binCount;

  const bins: RevenueBin[] = [];
  for (let i = 0; i < binCount; i++) {
    const low = min + i * binWidth;
    const high = min + (i + 1) * binWidth;
    const count = data.filter(
      (c) => c.total_revenue >= low && (i === binCount - 1 ? c.total_revenue <= high : c.total_revenue < high)
    ).length;
    bins.push({
      range: `₹${(low / 1000).toFixed(0)}K`,
      count,
    });
  }
  return bins;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RevenueBin }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">Revenue Range: {d.range}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-gray-400">Customers</span>
        <span className="text-sm font-semibold text-white">{formatNumber(d.count)}</span>
      </div>
    </div>
  );
}

export default function CustomerRevenueChart({ data }: CustomerRevenueChartProps) {
  const bins = buildRevenueBins(data);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.15 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-blue-400" />
          Customer Revenue Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Histogram of total revenue per customer</p>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={bins} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
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
            <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
