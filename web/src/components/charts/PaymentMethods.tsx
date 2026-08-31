'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import { CreditCard } from 'lucide-react';
import { formatINR, formatNumber, formatPercent } from '@/lib/utils/format';

interface PaymentData {
  payment_method: string;
  revenue: number;
  orders: number;
  percentage_of_orders: number;
}

interface PaymentMethodsProps {
  data: PaymentData[];
  totalOrders: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444'];

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: PaymentData }> }) {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-lg p-3 shadow-xl">
      <p className="text-sm font-medium text-white mb-1">{d.payment_method}</p>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Orders</span>
          <span className="text-sm text-white">{formatNumber(d.orders)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Revenue</span>
          <span className="text-sm font-semibold text-white">{formatINR(d.revenue)}</span>
        </div>
        <div className="flex items-center justify-between gap-6">
          <span className="text-xs text-gray-400">Order %</span>
          <span className="text-sm text-gray-300">{formatPercent(d.percentage_of_orders)}</span>
        </div>
      </div>
    </div>
  );
}

function formatLabel(props: { cx?: number; cy?: number; midAngle?: number; innerRadius?: number; outerRadius?: number; percent?: number }) {
  const { cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0 } = props;
  const RADIAN = Math.PI / 180;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.1) return null;

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={500}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

export default function PaymentMethods({ data, totalOrders }: PaymentMethodsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="bg-gray-800/50 border border-gray-700/50 rounded-xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-blue-400" />
            Payment Methods
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">Order distribution by payment</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative h-56 w-56 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
                dataKey="orders"
                labelLine={false}
                label={formatLabel}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} stroke="transparent" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <p className="text-[10px] uppercase tracking-wider text-gray-400 font-medium">Payment Mix</p>
            <p className="text-xl font-bold text-white mt-0.5">{formatNumber(totalOrders)}</p>
            <p className="text-[10px] text-gray-400">Orders</p>
          </div>
        </div>
        <div className="flex-1 space-y-2.5">
          {data.map((item, index) => (
            <div key={item.payment_method} className="flex items-center gap-2.5">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-300 truncate">{item.payment_method}</p>
              </div>
              <span className="text-xs text-gray-400">{formatPercent(item.percentage_of_orders)}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
