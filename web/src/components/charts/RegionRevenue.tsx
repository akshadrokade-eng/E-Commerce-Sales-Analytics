'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import { formatINR, formatNumber } from '@/lib/utils/format';

interface RegionData {
  region: string;
  revenue: number;
  orders: number;
  average_delivery_days: number;
}

interface RegionRevenueProps {
  data: RegionData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: RegionData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.region}</p>
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
          <span className="text-xs text-gray-400">Avg Delivery</span>
          <span className="text-sm text-gray-300">{d.average_delivery_days.toFixed(1)} days</span>
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

export default function RegionRevenue({ data }: RegionRevenueProps) {
  const sorted = [...data].sort((a, b) => b.revenue - a.revenue);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.35 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-400" />
            Region Performance
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Revenue by geographic region</p>
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
              dataKey="region"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#d1d5db' }}
              axisLine={false}
              tickLine={false}
              width={80}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar
              dataKey="revenue"
              fill="#10b981"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
