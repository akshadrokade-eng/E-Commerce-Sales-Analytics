'use client';

import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { CategoryData } from '@/types';

interface CategoryRevenueProps {
  data: CategoryData[];
}

function formatINR(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(2)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(2)}L`;
  }
  return `₹${value.toLocaleString('en-IN')}`;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { product_category: string; revenue: number; orders: number; quantity: number } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{data.product_category}</p>
        <p className="text-sm text-blue-400">Revenue: {formatINR(data.revenue)}</p>
        <p className="text-xs text-gray-400 mt-1">{data.orders} orders</p>
        <p className="text-xs text-gray-400">{data.quantity} units</p>
      </div>
    );
  }
  return null;
}

export default function CategoryRevenue({ data }: CategoryRevenueProps) {
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Category Performance</h3>
        <p className="text-sm text-gray-400">Revenue by product category</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={sortedData} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="product_category"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatINR(value)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
              {sortedData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
