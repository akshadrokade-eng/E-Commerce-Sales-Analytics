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
} from 'recharts';
import { RegionData } from '@/types';

interface RegionRevenueProps {
  data: RegionData[];
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

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: { region: string; revenue: number; orders: number; average_delivery_days: number } }> }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-3 shadow-xl">
        <p className="text-sm font-medium text-white mb-1">{data.region}</p>
        <p className="text-sm text-emerald-400">Revenue: {formatINR(data.revenue)}</p>
        <p className="text-xs text-gray-400 mt-1">{data.orders} orders</p>
        <p className="text-xs text-gray-400">
          Avg delivery: {data.average_delivery_days} days
        </p>
      </div>
    );
  }
  return null;
}

export default function RegionRevenue({ data }: RegionRevenueProps) {
  const sortedData = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white">Region Performance</h3>
        <p className="text-sm text-gray-400">Revenue by geographic region</p>
      </div>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sortedData}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              type="number"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatINR(value)}
            />
            <YAxis
              dataKey="region"
              type="category"
              stroke="#6b7280"
              tick={{ fontSize: 12 }}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="revenue" fill="#10b981" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
