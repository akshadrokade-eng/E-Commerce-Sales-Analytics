'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Package } from 'lucide-react';
import { formatINR, formatNumber } from '@/lib/utils/format';

interface CategoryData {
  product_category: string;
  revenue: number;
  orders: number;
  quantity: number;
}

interface CategoryRevenueProps {
  data: CategoryData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: CategoryData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.product_category}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Revenue</span>
          <span className="text-sm font-semibold text-white">{formatINR(d.revenue)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Orders</span>
          <span className="text-sm text-gray-300">{formatNumber(d.orders)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Quantity</span>
          <span className="text-sm text-gray-300">{formatNumber(d.quantity)}</span>
        </div>
      </div>
    </div>
  );
}

function formatYAxis(value: number) {
  if (value >= 1000000) return `₹${(value / 1000000).toFixed(1)}M`;
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

export default function CategoryRevenue({ data }: CategoryRevenueProps) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Package className="w-4 h-4 text-blue-400" />
            Category Performance
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Revenue by product category</p>
        </div>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sorted} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" horizontal={false} />
            <XAxis
              type="number"
              tickFormatter={formatYAxis}
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
            />
            <YAxis
              type="category"
              dataKey="product_category"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#d1d5db' }}
              axisLine={false}
              tickLine={false}
              width={100}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar
              dataKey="revenue"
              fill="#3b82f6"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
