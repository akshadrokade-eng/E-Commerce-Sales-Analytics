'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import { formatNumber } from '@/lib/utils/format';

interface DeliveryBin {
  days: number;
  count: number;
}

interface DeliveryDistributionProps {
  data: DeliveryBin[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: DeliveryBin }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.days} day{d.days !== 1 ? 's' : ''}</p>
      <div className="flex items-center justify-between gap-6">
        <span className="text-xs text-gray-400">Orders</span>
        <span className="text-sm font-semibold text-white">{formatNumber(d.count)}</span>
      </div>
    </div>
  );
}

export default function DeliveryDistribution({ data }: DeliveryDistributionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="mb-6">
        <h3 className="text-base font-semibold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-400" />
          Delivery Days Distribution
        </h3>
        <p className="text-xs text-gray-400 mt-0.5">Number of orders by delivery time</p>
      </div>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="days"
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              label={{ value: 'Delivery Days', position: 'insideBottom', offset: -5, fill: '#6b7280', fontSize: 10 }}
            />
            <YAxis
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(59, 130, 246, 0.08)' }} />
            <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} barSize={36} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
