'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';
import { formatINRDetailed } from '@/lib/utils/format';

interface MonthlyData {
  month: number;
  revenue: number;
  orders: number;
  quantity: number;
  average_order_revenue: number;
  month_name: string;
}

interface RevenueTrendProps {
  data: MonthlyData[];
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ value: number; payload: MonthlyData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.month_name}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Revenue</span>
          <span className="text-sm font-semibold text-white">{formatINRDetailed(d.revenue)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Orders</span>
          <span className="text-sm text-gray-300">{d.orders.toLocaleString('en-IN')}</span>
        </div>
      </div>
    </div>
  );
}

function formatXAxis(monthNum: number) {
  const names = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return names[monthNum] || '';
}

function formatYAxis(value: number) {
  if (value >= 100000) return `₹${(value / 100000).toFixed(0)}L`;
  return `₹${(value / 1000).toFixed(0)}K`;
}

export default function RevenueTrend({ data }: RevenueTrendProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-blue-400" />
            Revenue Trend
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Monthly revenue performance</p>
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" vertical={false} />
            <XAxis
              dataKey="month"
              tickFormatter={formatXAxis}
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={{ stroke: '#374151' }}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tickFormatter={formatYAxis}
              stroke="#6b7280"
              tick={{ fontSize: 11, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#revenueGradient)"
              dot={{ r: 3, fill: '#3b82f6', stroke: '#1e3a5f', strokeWidth: 2 }}
              activeDot={{ r: 5, fill: '#60a5fa', stroke: '#3b82f6', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
